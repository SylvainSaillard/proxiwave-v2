# Data Model: Proxiwave v2

**Généré le**: 2026-02-24 | **Branch**: `001-proxiwave-v2`

---

## Schéma relationnel

```
auth.users (Supabase Auth)
    │
    └──< profiles (1:1)
            │ role, client_id
            │
clients ────┤ (organisation)
    │       │
    └──< projects
            │
            ├──< project_members (M:M avec profiles — pour chef_de_projet)
            │
            ├──< tasks
            │       └──< subtasks
            │
            ├──< sprints
            │       └──< sprint_items
            │
            ├──< ideas
            ├──< project_messages
            └──< documents

contacts (standalone — formulaire landing)
```

---

## Tables

### `clients`
Organisation cliente (un client peut avoir N projets et N utilisateurs).

| Colonne | Type | Contraintes | Notes |
|---------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `name` | `text` | NOT NULL | Nom de l'organisation |
| `logo_url` | `text` | NULLABLE | URL Supabase Storage |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

**RLS** : superadmin → tous ; admin_client/chef_de_projet → son propre client.

---

### `profiles`
Extension de `auth.users` — un profil par utilisateur Supabase Auth.

| Colonne | Type | Contraintes | Notes |
|---------|------|-------------|-------|
| `id` | `uuid` | PK, FK → `auth.users(id)` ON DELETE CASCADE | |
| `role` | `text` | NOT NULL, CHECK IN ('superadmin','admin_client','chef_de_projet') | |
| `client_id` | `uuid` | FK → `clients(id)`, NULLABLE | NULL pour superadmin |
| `full_name` | `text` | NOT NULL | |
| `initials` | `text` | NOT NULL, max 2 chars | Ex: "SL" |
| `avatar_color` | `text` | NOT NULL, default '#6366f1' | Hex color |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

**Trigger** : Créer automatiquement un profil dans `profiles` à chaque INSERT dans `auth.users` (via Database Trigger ou après `auth.signUp` depuis Server Action).

**RLS** :
- Lecture : chaque utilisateur lit son propre profil ; superadmin lit tous
- Écriture (INSERT/UPDATE/DELETE) : superadmin uniquement (gestion des utilisateurs)

---

### `projects`

| Colonne | Type | Contraintes | Notes |
|---------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `client_id` | `uuid` | NOT NULL, FK → `clients(id)` | |
| `name` | `text` | NOT NULL | |
| `category` | `text` | NOT NULL | Ex: "IA Générative", "Automatisation" |
| `status` | `text` | NOT NULL, CHECK IN ('en_cours','terminé','à_venir') | |
| `progress` | `int2` | NOT NULL, DEFAULT 0, CHECK 0–100 | Progression globale en % |
| `start_date` | `date` | NULLABLE | |
| `end_date` | `date` | NULLABLE | Deadline |
| `satisfaction_score` | `int2` | NULLABLE, CHECK 0–10 | Score satisfaction client |
| `budget_total` | `numeric(12,2)` | NULLABLE | |
| `budget_consumed` | `numeric(12,2)` | NULLABLE, DEFAULT 0 | |
| `team_members` | `uuid[]` | NULLABLE | IDs des membres équipe Proxiwave assignés |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

**RLS** :
- superadmin : tous les projets (SELECT + INSERT + UPDATE + DELETE)
- admin_client : projets de son client (SELECT uniquement)
- chef_de_projet : projets dans `project_members` pour son `user_id` (SELECT uniquement)

---

### `project_members`
Table de jonction — assigne des chefs de projet à des projets.

| Colonne | Type | Contraintes | Notes |
|---------|------|-------------|-------|
| `project_id` | `uuid` | NOT NULL, FK → `projects(id)` ON DELETE CASCADE | |
| `user_id` | `uuid` | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | |

**PK** : `(project_id, user_id)`
**Index** : `(user_id)` pour les lookups RLS

---

### `tasks`

| Colonne | Type | Contraintes | Notes |
|---------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `project_id` | `uuid` | NOT NULL, FK → `projects(id)` ON DELETE CASCADE | |
| `sprint_id` | `uuid` | NULLABLE, FK → `sprints(id)` | |
| `title` | `text` | NOT NULL | |
| `description` | `text` | NULLABLE | |
| `status` | `text` | NOT NULL, CHECK IN ('validée','en_cours','livrée') | |
| `priority` | `text` | NOT NULL, CHECK IN ('haute','moyenne','basse') | |
| `progress_pct` | `int2` | NOT NULL, DEFAULT 0, CHECK 0–100 | |
| `start_week` | `date` | NULLABLE | Lundi de la semaine de début (Gantt) |
| `duration_weeks` | `int2` | NOT NULL, DEFAULT 1, CHECK > 0 | Durée en semaines (Gantt) |
| `start_date` | `date` | NULLABLE | Date début précise |
| `end_date` | `date` | NULLABLE | Date fin précise |
| `assigned_to` | `uuid` | NULLABLE, FK → `auth.users(id)` | Membre équipe Proxiwave |
| `tags` | `text[]` | NULLABLE, DEFAULT '{}' | |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

**RLS** : hérite de l'accès au projet parent (via `project_id`).

---

### `subtasks`

| Colonne | Type | Contraintes | Notes |
|---------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `task_id` | `uuid` | NOT NULL, FK → `tasks(id)` ON DELETE CASCADE | |
| `title` | `text` | NOT NULL | |
| `is_done` | `boolean` | NOT NULL, DEFAULT false | |
| `position` | `int2` | NOT NULL, DEFAULT 0 | Ordre d'affichage |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

---

### `sprints`

| Colonne | Type | Contraintes | Notes |
|---------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `project_id` | `uuid` | NOT NULL, FK → `projects(id)` ON DELETE CASCADE | |
| `name` | `text` | NOT NULL | Ex: "Sprint 1 — Foundation" |
| `status` | `text` | NOT NULL, CHECK IN ('terminé','actif','à_venir') | |
| `start_date` | `date` | NULLABLE | |
| `end_date` | `date` | NULLABLE | |
| `progress_pct` | `int2` | NOT NULL, DEFAULT 0, CHECK 0–100 | |
| `billing_amount` | `numeric(12,2)` | NULLABLE | Montant de facturation du sprint |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

---

### `sprint_items`

| Colonne | Type | Contraintes | Notes |
|---------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `sprint_id` | `uuid` | NOT NULL, FK → `sprints(id)` ON DELETE CASCADE | |
| `title` | `text` | NOT NULL | |
| `status` | `text` | NOT NULL, CHECK IN ('validé','en_cours','livré') | |
| `position` | `int2` | NOT NULL, DEFAULT 0 | |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

---

### `ideas`

| Colonne | Type | Contraintes | Notes |
|---------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `project_id` | `uuid` | NOT NULL, FK → `projects(id)` ON DELETE CASCADE | |
| `author_id` | `uuid` | NOT NULL, FK → `auth.users(id)` | |
| `title` | `text` | NOT NULL | |
| `status` | `text` | NOT NULL, DEFAULT 'nouvelle', CHECK IN ('nouvelle','en_revue','acceptée','refusée') | |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

**Machine d'états** : `nouvelle` → `en_revue` → `acceptée` | `refusée`
**RLS** :
- SELECT : tous les utilisateurs ayant accès au projet
- INSERT : admin_client et chef_de_projet (côté client uniquement)
- UPDATE (status) : superadmin uniquement

---

### `project_messages`

| Colonne | Type | Contraintes | Notes |
|---------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `project_id` | `uuid` | NOT NULL, FK → `projects(id)` ON DELETE CASCADE | |
| `author_id` | `uuid` | NOT NULL, FK → `auth.users(id)` | |
| `content` | `text` | NOT NULL | |
| `message_type` | `text` | NOT NULL, CHECK IN ('client','équipe') | Détermine l'affichage gauche/droite |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

**RLS** : SELECT + INSERT pour tous les utilisateurs ayant accès au projet.

---

### `documents`

| Colonne | Type | Contraintes | Notes |
|---------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `project_id` | `uuid` | NOT NULL, FK → `projects(id)` ON DELETE CASCADE | |
| `author_id` | `uuid` | NOT NULL, FK → `auth.users(id)` | |
| `name` | `text` | NOT NULL | Nom du fichier affiché |
| `file_type` | `text` | NOT NULL, CHECK IN ('pdf','figma','sheet','doc','image') | |
| `category` | `text` | NOT NULL, CHECK IN ('livrable','spécification','design','rapport','facture') | |
| `file_size` | `int8` | NOT NULL | Taille en bytes |
| `storage_path` | `text` | NOT NULL | Chemin dans Supabase Storage |
| `is_favorite` | `boolean` | NOT NULL, DEFAULT false | Persisté par utilisateur → voir `document_favorites` |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

> **Note** : `is_favorite` devrait idéalement être dans une table `document_favorites (document_id, user_id)` pour le support multi-utilisateurs. Pour v2, la colonne sur `documents` est suffisante (un seul superadmin gère les favoris). Évolution possible en v3.

**RLS** :
- SELECT : tous les utilisateurs ayant accès au projet
- INSERT/UPDATE/DELETE : superadmin uniquement

---

### `contacts`
Entrées du formulaire de contact de la landing page.

| Colonne | Type | Contraintes | Notes |
|---------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `name` | `text` | NOT NULL | |
| `email` | `text` | NOT NULL | |
| `message` | `text` | NOT NULL | |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

**RLS** : INSERT public (pas d'auth requise) ; SELECT superadmin uniquement.

---

## Index recommandés

```sql
-- Lookups fréquents par client
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_profiles_client_id ON profiles(client_id);

-- Lookups RLS chef_de_projet
CREATE INDEX idx_project_members_user_id ON project_members(user_id);

-- Lookups par projet (tables enfants)
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_sprints_project_id ON sprints(project_id);
CREATE INDEX idx_ideas_project_id ON ideas(project_id);
CREATE INDEX idx_project_messages_project_id ON project_messages(project_id);
CREATE INDEX idx_documents_project_id ON documents(project_id);

-- Tri chronologique fréquent
CREATE INDEX idx_project_messages_created_at ON project_messages(project_id, created_at DESC);
```

---

## Fonctions SQL helper (pour RLS)

```sql
-- Retourne le rôle de l'utilisateur courant
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Retourne le client_id de l'utilisateur courant (NULL pour superadmin)
CREATE OR REPLACE FUNCTION public.get_my_client_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT client_id FROM public.profiles WHERE id = auth.uid();
$$;
```

> `STABLE` : Postgres peut inliner et cacher le résultat pour la durée d'une requête.
> `SECURITY DEFINER` : s'exécute avec les droits du propriétaire (bypasse le RLS de `profiles` pour ce seul SELECT).
