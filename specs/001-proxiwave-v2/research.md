# Research: Proxiwave v2 — Décisions techniques

**Généré le**: 2026-02-24 | **Branch**: `001-proxiwave-v2`

---

## 1. Next.js 15 App Router + Supabase Auth

### Decision
Utiliser le package `@supabase/ssr` (pas `@supabase/auth-helpers-nextjs`, déprécié depuis 2024).

### Patterns clés

**Trois factories `createClient` distinctes :**

| Fichier | Usage | Notes |
|---------|-------|-------|
| `lib/supabase/server.ts` | Server Components + Server Actions | Async (Next.js 15) |
| `lib/supabase/client.ts` | Client Components uniquement | Sync |
| `lib/supabase/admin.ts` | Opérations admin (bypass RLS) | Service role — serveur uniquement |

**Gotcha Next.js 15 critique** : `cookies()` et `headers()` de `next/headers` sont désormais **async**. `createClient()` côté serveur doit être `async` et `await`-é partout. Oublier ce `await` cause un bug silencieux où `auth.getUser()` retourne toujours `null`.

**Règle de sécurité absolue** : Toujours `supabase.auth.getUser()`, jamais `supabase.auth.getSession()` côté serveur. `getSession()` lit le JWT du cookie sans revalidation — spoofable.

**Middleware** : Doit retourner `supabaseResponse` (la variable créée avec `NextResponse.next({ request })`), pas un nouveau `NextResponse.next()`. C'est lui qui propage les tokens de session rafraîchis.

**Server Actions vs Route Handlers** :
- Server Actions pour toutes les mutations CRUD (CSRF intégré dans Next.js 15, colocation avec les composants)
- Route Handlers réservés aux webhooks externes (Stripe, etc.) et aux endpoints publics sans auth

### Rationale
`@supabase/auth-helpers-nextjs` est explicitement déprécié dans la documentation officielle Supabase depuis 2024. `@supabase/ssr` est le successeur officiel et gère correctement la synchronisation des cookies entre middleware, Server Components, Client Components et Server Actions dans Next.js 15.

---

## 2. RLS Multi-tenant (3 rôles)

### Decision
Table `profiles` comme source de vérité pour les rôles, avec des fonctions SQL `STABLE` comme helpers RLS.

### Rationale
Les custom JWT claims nécessiteraient un webhook Database + Edge Function pour peupler le JWT au sign-in, plus une logique de refresh quand les rôles changent. Une table `profiles` avec des fonctions helper est plus simple, toujours cohérente avec la BDD, et évite les problèmes de staleness JWT.

Les fonctions `STABLE` permettent à Postgres de les inliner et de cacher leur résultat dans la durée d'une seule requête — performances optimales quand plusieurs politiques RLS s'enchaînent.

### Fonctions helper RLS

```sql
public.get_my_role()        -- 'superadmin' | 'admin_client' | 'chef_de_projet'
public.get_my_client_id()   -- UUID du client associé, NULL pour superadmin
```

### Logique par rôle

| Rôle | `clients` | `projects` | `tasks`, `sprints`, `ideas`, `messages`, `documents` |
|------|-----------|------------|------------------------------------------------------|
| `superadmin` | Tous | Tous | Tous |
| `admin_client` | Son client | `client_id = get_my_client_id()` | Via les projets de son client |
| `chef_de_projet` | Son client | EXISTS dans `project_members` | Via ses projets assignés |

### Service role
Utilisé côté serveur uniquement (jamais exposé client) pour les opérations qui bypassent RLS : création d'utilisateur, seeding, opérations d'administration système.

---

## 3. i18n : next-intl

### Decision
**next-intl** remplace i18next/react-i18next du prototype.

### Rationale

| Critère | next-intl | i18next/react-i18next |
|---------|-----------|-----------------------|
| Server Components | Natif, first-class | Nécessite un setup serveur séparé |
| App Router routing | Built-in | Manuel |
| Bundle client | Seules les traductions utilisées côté client | Tout le bundle i18next |
| Format JSON | Compatible avec le prototype | N/A |
| TypeScript | Types natifs pour les clés | Setup supplémentaire requis |

**Approche retenue** : Pas de segment `[locale]` dans les URLs. Locale détectée depuis les préférences navigateur (`Accept-Language`) ou un cookie de préférence, sans modifier la structure des routes. Les URLs restent `/dashboard` et non `/fr/dashboard`. Simplifie le routing sans sacrifier le bilinguisme.

**Migration depuis le prototype** : Les fichiers JSON de traduction (`fr.json`, `en.json`) sont directement réutilisables. L'API change légèrement : `useTranslation('ns')` → `useTranslations('ns')`, `t('key')` reste identique.

---

## 4. Testing

### Decision
- **Unit / composants** : Vitest + React Testing Library
- **E2E** : Playwright

### Rationale

**Vitest vs Jest** : Vitest est ESM-natif (2-5x plus rapide), config minimale, API quasi-identique à Jest. Next.js 15 avec Turbopack s'aligne mieux avec l'écosystème esbuild/Vite. Les RSC ne peuvent pas être testés unitairement (pas de rendu RSC hors du runtime Next.js) → leur logique est testée en isolation, leur rendu en E2E.

**Playwright vs Cypress** : Playwright est listé en premier dans la documentation officielle Next.js depuis 2024. API `async/await` propre (sans les anti-patterns de la chaîne Cypress). Parallélisme natif = CI plus rapide pour les flux auth (redirections Supabase).

**Mocking Supabase** :
- Vitest : `vi.mock('@supabase/ssr')` + `vi.mock('next/headers', () => ({ cookies: () => ({...}) }))`
- Playwright : `supabase start` via Supabase CLI dans CI — tests contre une vraie instance isolée avec données de seed

---

## 5. Supabase — Cible : Supabase Cloud

### Decision
**Supabase Cloud** directement (project ref: `rteuevldfahmxsnafexa`). Pas de self-hosted pour ce projet.

### Workflow

| Env | Infra | `.env` |
|-----|-------|--------|
| Dev local | Supabase CLI (`supabase start`) — optionnel pour itérer rapidement | `.env.local` → `localhost:54321` |
| Production | Supabase Cloud (`rteuevldfahmxsnafexa`) | `.env.production` → URL Cloud |

**Migrations** : Fichiers SQL dans `supabase/migrations/` committés dans git. Déployés avec `supabase db push` (CLI lié au projet Cloud).

### Pré-intégration obligatoire
Avant d'appliquer le nouveau schéma sur le projet Cloud :
1. **Supprimer toutes les tables existantes** (via Supabase Dashboard SQL Editor ou migration DROP)
2. **Supprimer toutes les Edge Functions existantes** (via `supabase functions delete <name>` ou Dashboard)
3. Appliquer les nouvelles migrations depuis zéro

---

## 6. Email notifications — Resend + React Email

### Decision
**Resend + React Email**, appelé depuis un Next.js API Route.

### Rationale

| Option | Setup | Fiabilité | DX |
|--------|-------|-----------|-----|
| **Resend + React Email** | Minimal (1 clé API) | Élevée | Excellent |
| SendGrid | Moyen | Très élevée | Médiocre |
| Edge Functions + provider | Élevé | Dépend du self-hosted | Acceptable |
| Nodemailer + SMTP | Moyen (code) | Faible (SMTP + serverless) | Mauvaise |

**Latence de livraison** : 1–5 secondes → SC-007 (< 60s) largement respecté.
**Free tier** : 3 000 emails/mois, 100/jour — suffisant pour un formulaire de contact.
**Templates** : React Email donne des templates type-safe en composants React, versionnés dans le repo, avec un serveur de preview local.

**Flux contact** : `POST /api/contact` → persist dans table `contacts` (Supabase) + envoi email (Resend) en séquence. L'audit trail est conservé en BDD.

---

## Résumé des décisions

| Domaine | Décision | Alternatives rejetées |
|---------|----------|-----------------------|
| Package auth Supabase | `@supabase/ssr` | `@supabase/auth-helpers-nextjs` (déprécié) |
| Rôles / RLS | Table `profiles` + fonctions `STABLE` | Custom JWT claims (complexe, staleness) |
| Mutations | Server Actions (CSRF intégré) | Route Handlers REST (boilerplate inutile) |
| i18n | next-intl | i18next (pas conçu pour RSC) |
| Tests unitaires | Vitest + RTL | Jest (ESM pénible, plus lent) |
| Tests E2E | Playwright | Cypress (single-threaded, API chaînable) |
| Dev local | `supabase start` CLI | Cloud free en dev (pas isolé par dev) |
| Email | Resend + React Email | Nodemailer (SMTP inadapté au serverless) |
