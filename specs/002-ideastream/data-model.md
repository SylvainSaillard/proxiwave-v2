# IdeaStream — Data model cible (refonte complète)

> Statut : **proposition, à valider avant migration SQL**.
> Approche : refonte complète. On remplace `tasks/forfaits/sprint_items/project_messages/documents/ideas` par un modèle centré sur l'**idée** comme entité racine. On conserve `auth.users`, `profiles`, `clients`, `contacts`.

## Philosophie du modèle

- **L'idée est l'entité métier centrale**. Elle naît (`sandbox`), peut être approuvée, entre en développement (`in_dev`), et est livrée (`shipped`).
- **Le projet est un container thématique** qui regroupe des idées et héberge les sprints d'exécution. Sa raison d'être est de fournir un contexte (catégorie, équipe, deadline), pas de piloter le détail des tâches.
- **Le sprint est un cycle d'exécution temporel**. Il associe N idées approuvées à une période. La vélocité = nb d'idées passées de `approved` à `shipped` pendant le sprint.
- **Les actions des utilisateurs émettent des XP events**, qui sont la source de vérité pour le score et l'historique. Le `xp_points` et `level` sur `profiles` sont des dénormalisations recalculables.
- **Tout fait social déclenche une activity_log entry** qui alimente le Community Pulse.

## Entités

### A. Utilisateurs et organisations (conservées)

#### `clients` *(conservée telle quelle)*
```
id            UUID PK
name          TEXT
logo_url      TEXT?
created_at    TIMESTAMPTZ
```

#### `profiles` *(étendue)*
```
id              UUID PK (= auth.users.id)
client_id       UUID? FK clients
role            TEXT { 'admin', 'client', 'team_member' }   -- mapping simplifié
full_name       TEXT
initials        TEXT (≤2)
avatar_color    TEXT
avatar_url      TEXT?                                       -- nouveau
bio             TEXT?                                       -- nouveau
xp_points       INTEGER NOT NULL DEFAULT 0                  -- nouveau
level           SMALLINT NOT NULL DEFAULT 1                 -- nouveau (calculé)
level_title     TEXT NOT NULL DEFAULT 'Newcomer'            -- nouveau (Visionary, Innovator, etc.)
current_streak  SMALLINT NOT NULL DEFAULT 0                 -- nouveau (jours consécutifs)
longest_streak  SMALLINT NOT NULL DEFAULT 0                 -- nouveau
last_active_at  DATE?                                       -- nouveau (pour calcul streak)
created_at      TIMESTAMPTZ
```

**Mapping rôles** : `superadmin` → `admin`, `admin_client` → `client`, `chef_de_projet` → `team_member`. Migration de rôles à scripter.

### B. Idées et leurs satellites

#### `idea_categories` *(nouvelle)*
```
id          UUID PK
slug        TEXT UNIQUE  -- 'ui_ux', 'backend', 'mobile', 'feature_request', 'design'
label       TEXT         -- 'UI/UX', 'Backend', etc.
color       TEXT         -- couleur hex pour chips
icon        TEXT?        -- nom d'icône Material Symbols
position    SMALLINT
```

#### `ideas` *(refonte complète)*
```
id                UUID PK
title             TEXT NOT NULL
description       TEXT
category_id       UUID FK idea_categories
status            TEXT { 'sandbox', 'approved', 'in_dev', 'shipped', 'rejected' }
                  -- mapping écrans: In Dev=in_dev, Approved=approved, Shipped=shipped, Sandbox=sandbox
author_id         UUID FK profiles
project_id        UUID? FK projects        -- une idée peut vivre hors projet (sandbox)
sprint_id         UUID? FK sprints         -- assignée à un sprint si in_dev
upvotes_count     INTEGER NOT NULL DEFAULT 0  -- dénormalisé pour tri/affichage
comments_count    INTEGER NOT NULL DEFAULT 0
complexity_score  SMALLINT? CHECK BETWEEN 0 AND 10
estimated_delivery DATE?
shipped_at        TIMESTAMPTZ?
approved_at       TIMESTAMPTZ?
created_at        TIMESTAMPTZ
updated_at        TIMESTAMPTZ
```

#### `idea_votes` *(nouvelle)*
```
idea_id     UUID FK ideas
user_id     UUID FK profiles
created_at  TIMESTAMPTZ
PRIMARY KEY (idea_id, user_id)
```
Trigger : sur INSERT/DELETE, recalcule `ideas.upvotes_count`. Émet un `xp_events` (+5 pour l'auteur de l'idée, +1 pour le voteur). Émet une `activity_logs` entry.

#### `idea_comments` *(nouvelle, remplace `project_messages`)*
```
id            UUID PK
idea_id       UUID FK ideas
author_id     UUID FK profiles
parent_id     UUID? FK idea_comments       -- pour les réponses nested
content       TEXT NOT NULL
created_at    TIMESTAMPTZ
edited_at     TIMESTAMPTZ?
```
Trigger : recalcule `ideas.comments_count`, émet XP event (+2 commentaire, +1 reply) et activity_log.

#### `idea_artifacts` *(remplace `documents`)*
```
id            UUID PK
idea_id       UUID FK ideas
uploader_id   UUID FK profiles
name          TEXT
file_type     TEXT { 'figma', 'image', 'pdf', 'doc', 'sheet', 'link' }
url           TEXT             -- storage_path ou URL externe (Figma)
file_size     BIGINT?
created_at    TIMESTAMPTZ
```
Les "design artifacts" du mockup desktop sont des entrées de cette table filtrées par idea_id.

### C. Projets et sprints (rôle secondaire)

#### `projects` *(simplifiée)*
```
id              UUID PK
client_id       UUID FK clients
name            TEXT
description     TEXT
category        TEXT   -- 'strategic', 'core', 'beta', 'internal', 'finishing'
status          TEXT { 'active', 'archived', 'on_hold' }
color           TEXT   -- pour border-l des cards (primary/secondary/tertiary)
team_member_ids UUID[]
deadline        DATE?
created_at      TIMESTAMPTZ
```

Tables supprimées : `team_members` reste un array d'UUID pour le MVP (lecture seule). Si besoin de relations riches plus tard, normaliser en `project_members`.

#### `sprints` *(simplifiée)*
```
id              UUID PK
project_id      UUID FK projects
sprint_number   SMALLINT          -- "Sprint 24", "Sprint 25"
name            TEXT?             -- "Innovation Cycle #12"
status          TEXT { 'upcoming', 'active', 'completed' }
start_date      DATE
end_date        DATE
velocity_score  SMALLINT          -- ex: 78 (%)
ideas_total     SMALLINT
ideas_shipped   SMALLINT
created_at      TIMESTAMPTZ
```

Le lien sprint ↔ idea passe par `ideas.sprint_id` (déjà défini en B).

**Tables supprimées du modèle v1** : `tasks`, `subtasks`, `sprint_items`, `forfaits`, `project_messages`, `documents`. Données archivées avant drop (export JSON séparé si besoin de récupération).

### D. Gamification

#### `xp_events` *(nouvelle, source de vérité)*
```
id            UUID PK
user_id       UUID FK profiles
event_type    TEXT { 'idea_created', 'idea_approved', 'idea_shipped', 'vote_cast', 'vote_received', 'comment_posted', 'comment_received', 'achievement_unlocked' }
amount        SMALLINT     -- XP gagnés (peut être négatif)
ref_table     TEXT?        -- 'ideas', 'idea_comments', 'achievements'
ref_id        UUID?
created_at    TIMESTAMPTZ
```
`profiles.xp_points` = SUM(amount) sur cette table pour le user. Une vue matérialisée peut servir, mais pour le MVP un trigger sur INSERT recalcule la somme.

**Barème indicatif** (à confirmer) :
| Action | XP émetteur | XP cible |
|---|---|---|
| Idea créée | +20 | — |
| Idea approved | +50 | — (auteur) |
| Idea shipped | +100 | — (auteur) |
| Vote cast | +1 (voteur) | +5 (auteur idée) |
| Comment posted | +2 (commentateur) | +1 (auteur idée) |
| Achievement unlocked | +X (variable) | — |

#### `achievements` *(catalogue, nouvelle)*
```
id            UUID PK
slug          TEXT UNIQUE   -- 'fast_starter', 'collaborator', 'thought_leader'
name          TEXT          -- 'Fast Starter'
description   TEXT
icon          TEXT          -- nom d'icône
color         TEXT          -- couleur du badge
xp_reward     SMALLINT
condition     JSONB         -- ex: { "type": "idea_count", "min": 5, "window_days": 7 }
```

#### `user_achievements` *(nouvelle)*
```
user_id        UUID FK profiles
achievement_id UUID FK achievements
unlocked_at    TIMESTAMPTZ
PRIMARY KEY (user_id, achievement_id)
```

### E. Activité sociale

#### `activity_logs` *(nouvelle, alimente Community Pulse)*
```
id            UUID PK
actor_id      UUID FK profiles
verb          TEXT { 'upvoted', 'commented', 'created_idea', 'shipped_idea', 'unlocked_achievement', 'reached_streak', 'reached_xp_milestone' }
object_type   TEXT     -- 'idea', 'comment', 'achievement', 'streak', 'level'
object_id     UUID?
target_user_id UUID? FK profiles   -- pour "X upvoted YOUR idea"
metadata      JSONB    -- texte custom, valeurs (ex: streak_days: 12)
created_at    TIMESTAMPTZ
```
Lecture pour Community Pulse : ORDER BY created_at DESC LIMIT 20 + filtres optionnels (par catégorie, par projet, suivis).

### F. Tables conservées inchangées

- `contacts` (formulaire landing) — aucune modification.
- `auth.users` (Supabase) — aucune modification.

## Index suggérés

```sql
CREATE INDEX idx_ideas_status              ON ideas(status);
CREATE INDEX idx_ideas_project_id          ON ideas(project_id);
CREATE INDEX idx_ideas_sprint_id           ON ideas(sprint_id);
CREATE INDEX idx_ideas_category_id         ON ideas(category_id);
CREATE INDEX idx_ideas_upvotes_count_desc  ON ideas(upvotes_count DESC);
CREATE INDEX idx_idea_votes_user_id        ON idea_votes(user_id);
CREATE INDEX idx_idea_comments_idea_id     ON idea_comments(idea_id, created_at DESC);
CREATE INDEX idx_xp_events_user_id         ON xp_events(user_id, created_at DESC);
CREATE INDEX idx_activity_logs_recent      ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_actor       ON activity_logs(actor_id, created_at DESC);
```

## RLS — principes

- **Lecture publique authentifiée** : `idea_categories`, `achievements` (catalogues).
- **Lecture filtrée par client** : `projects`, `sprints`, `ideas` (un user ne voit que les projets de son `client_id`, l'`admin` voit tout).
- **Écriture restreinte** :
  - Idée : auteur ou admin pour modifier ; n'importe quel user authentifié pour créer.
  - Vote : seul `auth.uid()` peut créer son propre vote.
  - Commentaire : auteur ou admin pour modifier ; tout user du même client pour créer.
  - `profiles.xp_points`, `level`, `streak` : modification uniquement via fonctions `SECURITY DEFINER` déclenchées par triggers (pas d'écriture directe par le client).

## Triggers à prévoir

1. `trg_idea_votes_count` — recalcule `ideas.upvotes_count` après INSERT/DELETE sur `idea_votes`, émet `xp_events` + `activity_logs`.
2. `trg_idea_comments_count` — idem pour comments.
3. `trg_idea_status_xp` — quand `ideas.status` passe à `approved`/`shipped`, émet `xp_events` à l'auteur + `activity_logs`.
4. `trg_xp_recalc_profile` — après INSERT sur `xp_events`, recalcule `profiles.xp_points` et `level` (lookup dans un tableau de seuils).
5. `trg_streak_update` — à chaque action utilisateur (idea/comment/vote), met à jour `profiles.last_active_at` et incrémente `current_streak` si veille = avant-hier.
6. `trg_achievement_check` — après XP event, évalue les conditions des achievements non-unlocked et insère dans `user_achievements` si match.

## Phase MVP lecture seule

Pour la phase MVP (les 4 écrans en lecture), on **n'écrit PAS encore le SQL**. On écrit :
- les **types TypeScript** correspondants dans `src/types/ideastream.ts`
- des **fixtures statiques** dans `src/lib/fixtures/ideastream.ts` qui retournent les mêmes shapes

Cela permet de valider la direction visuelle sans engager la dette de migration. Le SQL est rédigé en parallèle (relecture par toi) mais déployé seulement quand on attaque les écritures.

## Questions ouvertes à arbitrer

1. **Rôle `team_member` vs `chef_de_projet`** : on garde la même sémantique ou on en profite pour redéfinir ?
2. **`color` sur `projects` et `idea_categories`** : enum borné (3-4 valeurs liées au design system) ou texte libre ?
3. **`activity_logs`** : on log tout ou on filtre ? (Le Community Pulse n'a besoin que de ~10 entrées récentes — pas de raison d'archiver des millions de lignes si on ne s'en sert pas.)
4. **Localisation** : les `level_title` ("Visionary", "Innovator") sont-ils côté DB ou côté code i18n ? Recommandation : côté code, la DB stocke un slug.
5. **Soft delete** : besoin pour `ideas` (idée rétractée par l'auteur) ? Recommandation : oui, ajouter `deleted_at` sur `ideas` et `idea_comments`.
