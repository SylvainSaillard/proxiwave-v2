# Quickstart: Proxiwave v2 — Nouveau repo

**Généré le**: 2026-02-24 | **Branch**: `001-proxiwave-v2`

---

## Prérequis

- Node.js 20+
- Docker Desktop (pour Supabase local)
- Supabase CLI : `npm install -g supabase` ou `brew install supabase/tap/supabase`
- pnpm 9+ (recommandé) ou npm

---

## 1. Créer le nouveau repo

```bash
# Créer le projet Next.js 15
npx create-next-app@latest proxiwave-v2 \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd proxiwave-v2
```

---

## 2. Installer les dépendances

```bash
pnpm add @supabase/supabase-js @supabase/ssr
pnpm add next-intl
pnpm add framer-motion
pnpm add lucide-react
pnpm add resend @react-email/components

pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @playwright/test
```

---

## 3. Initialiser Supabase local

```bash
# Initialise le dossier supabase/ dans le repo
supabase init

# Démarre la stack locale (PostgreSQL + Auth + Storage + Studio)
supabase start
```

Après `supabase start`, noter les URLs affichées :
```
API URL: http://localhost:54321
Studio:  http://localhost:54323
anon key: eyJ...
service_role key: eyJ...
```

---

## 4. Variables d'environnement

Créer `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key ci-dessus>
SUPABASE_SERVICE_ROLE_KEY=<service_role key ci-dessus>
RESEND_API_KEY=<clé Resend — https://resend.com>
```

> **Ne jamais committer `.env.local`** — il est dans `.gitignore` par défaut.

---

## 5. Créer les clients Supabase

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies() // IMPORTANT: await en Next.js 15
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch { /* Server Component — ignoré, middleware gère le refresh */ }
        },
      },
    }
  )
}
```

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// lib/supabase/admin.ts
// ATTENTION : ne jamais importer depuis un Client Component
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
```

---

## 6. Middleware (session refresh + route guard)

```typescript
// middleware.ts (racine du projet)
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value, options)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isAuth = request.nextUrl.pathname.startsWith('/login')
    || request.nextUrl.pathname.startsWith('/auth')

  if (!user && isDashboard) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuth) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse // IMPORTANT: toujours retourner supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

---

## 7. Appliquer les migrations

```bash
# Créer la migration initiale (schema complet)
supabase db diff -f initial_schema

# Éditer supabase/migrations/<timestamp>_initial_schema.sql avec le contenu de data-model.md

# Appliquer
supabase db reset  # rejoue toutes les migrations + seed.sql

# Générer les types TypeScript
supabase gen types typescript --local > types/database.ts
```

---

## 8. Configurer next-intl

```typescript
// i18n.ts (racine)
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  // Locale depuis cookie ou Accept-Language header
  const locale = 'fr' // à remplacer par détection dynamique
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
```

```typescript
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin()

export default withNextIntl({
  // config Next.js
})
```

---

## 9. Lancer le dev

```bash
pnpm dev
# App : http://localhost:3000
# Supabase Studio : http://localhost:54323
```

---

## 10. Commandes utiles

```bash
# Tests unitaires
pnpm vitest

# Tests E2E (avec Supabase local actif)
pnpm playwright test

# Générer une nouvelle migration après changement de schéma
supabase db diff -f <nom_de_la_migration>

# Régénérer les types TypeScript
supabase gen types typescript --local > types/database.ts

# Arrêter Supabase local
supabase stop
```

---

## Workflow de développement

```
1. Modifier le schéma dans Supabase Studio (localhost:54323)
2. supabase db diff -f <feature_name>    → fichier SQL dans supabase/migrations/
3. git add supabase/migrations/           → committer la migration
4. supabase gen types typescript --local > types/database.ts
5. Implémenter la feature
6. pnpm vitest && pnpm playwright test
7. PR → merge → CI applique la migration en staging/prod
```

---

## Checklist avant premier commit

- [ ] `.env.local` dans `.gitignore` ✓
- [ ] `SUPABASE_SERVICE_ROLE_KEY` jamais importé dans un Client Component
- [ ] `supabase.auth.getUser()` (pas `getSession()`) dans tous les Server Components
- [ ] Middleware retourne `supabaseResponse` (pas `NextResponse.next()`)
- [ ] RLS activé sur toutes les tables
- [ ] `tsconfig.json` avec `"strict": true`
- [ ] `types/database.ts` généré par Supabase CLI (pas écrit à la main)
