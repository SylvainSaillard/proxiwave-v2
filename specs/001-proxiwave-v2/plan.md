# Implementation Plan: Proxiwave v2 — Plateforme de gestion de projets IA

**Branch**: `001-proxiwave-v2` | **Date**: 2026-02-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-proxiwave-v2/spec.md`

---

## Summary

Construire Proxiwave v2 comme un nouveau repo Next.js 15 (App Router) + Supabase, reproduisant 100% du prototype avec des données persistantes réelles, une authentification multi-rôles (superadmin / admin_client / chef_de_projet), et une isolation stricte des données clients par Row Level Security. Le prototype React/Vite est la référence UX — le design system (palette pw-*, cream, warm-*, bento cards) est conservé à l'identique.

---

## Technical Context

**Language/Version**: TypeScript 5.x — strict mode, `noImplicitAny: true`, zéro `any` (Constitution III)
**Primary Dependencies**: Next.js 15.x (App Router), `@supabase/ssr` v0.5+ + `@supabase/supabase-js` v2, Tailwind CSS 3, Framer Motion 11, Lucide React, next-intl, Resend + React Email
**Storage**: PostgreSQL via **Supabase Cloud** (project ref: `rteuevldfahmxsnafexa`) ; Supabase Storage pour les fichiers. Avant toute migration : DROP de toutes les tables existantes + suppression de toutes les Edge Functions.
**Testing**: Vitest + React Testing Library (unit/composants) ; Playwright (E2E)
**Target Platform**: Web — mobile-first, navigateurs modernes (Chrome/Firefox/Safari/Edge)
**Project Type**: Web application full-stack (Next.js monorepo — App Router, Server Actions, pas d'API REST séparée)
**Performance Goals**: LCP/CLS/FID dans les seuils « Good » Google (Constitution V) ; chargement dashboard < 2 secondes (SC-002)
**Constraints**: RLS obligatoire sur toutes les tables (SC-003) ; `cookies()` est async en Next.js 15 (gotcha critique) ; jamais `getSession()` côté serveur ; UI/UX du prototype gelée (aucune modification visuelle)
**Scale/Scope**: Multi-tenant SaaS — N clients, M projets/client, 3 rôles ; volume initial < 100 utilisateurs

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principe | Statut | Notes |
|----------|--------|-------|
| **I. Intégration sans friction** | ✅ PASS | Dashboard conserve l'UX et les workflows du prototype ; aucun changement de comportement imposé |
| **II. Résultats mesurables** | ✅ PASS | SC-001 à SC-008 définissent des métriques concrètes ; livrables découpés en phases < 4 semaines |
| **III. TypeScript strict, zéro `any`** | ✅ PASS | Supabase gen types + interfaces dans `types/` ; `any` interdit par `tsconfig` strict |
| **IV. Composants autonomes** | ✅ PASS | Pattern bento-block conservé, données via props/context, composants testables indépendamment |
| **V. Accessibilité, Performance, Responsive** | ✅ PASS | mobile-first obligatoire, alt/aria-label requis, Framer Motion respecte `prefers-reduced-motion` |
| **Stack (section constitution)** | ⚠️ DÉVIATION JUSTIFIÉE | La constitution décrit le prototype (Vite + React Router + mockData). Le nouveau repo cible Next.js 15 + Supabase. Déviation documentée ici — la constitution sera re-ratifiée pour le nouveau repo après Phase 1. Les principes I–V restent inchangés. |

**Constitution re-check post-design**: ✅ Aucune nouvelle violation détectée après conception du data model et des contrats.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-proxiwave-v2/
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── server-actions.md   # Phase 1 output
│   └── rls-policies.sql    # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (nouveau repo — `proxiwave-v2`)

```text
proxiwave-v2/
├── app/
│   ├── (public)/                       # Routes publiques (pas d'auth requise)
│   │   ├── layout.tsx
│   │   └── page.tsx                    # Landing page
│   ├── (auth)/                         # Routes d'authentification
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts            # OAuth callback handler
│   └── (dashboard)/                    # Routes protégées (auth guard dans layout)
│       ├── layout.tsx                  # Vérification session + Sidebar
│       ├── dashboard/
│       │   └── page.tsx                # Vue projets + stats + messages récents
│       └── dashboard/project/
│           └── [id]/
│               └── page.tsx            # Détail projet (Gantt, Sprints, Idées, Messages, Documents)
│
├── components/
│   ├── ui/                             # Primitives réutilisables (Button, Card, Badge, Avatar...)
│   ├── landing/                        # Sections landing (Hero, Approach, Results, Process, Contact, Footer)
│   ├── dashboard/                      # Composants dashboard (ProjectCard, StatsBar, MessagesPanel...)
│   └── project/                        # Composants détail projet (GanttChart, TaskPanel, SprintCard, IdeaBox...)
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts                   # createClient async — Server Components + Server Actions
│   │   ├── client.ts                   # createClient sync — Client Components uniquement
│   │   └── admin.ts                    # supabaseAdmin (service role) — serveur uniquement, jamais client
│   └── utils.ts                        # Helpers généraux (cn, formatDate, etc.)
│
├── hooks/                              # React hooks (Client Components uniquement)
│
├── types/
│   ├── database.ts                     # Types auto-générés par `supabase gen types typescript`
│   └── app.ts                          # Types applicatifs partagés (enums, DTOs, etc.)
│
├── emails/
│   └── ContactNotification.tsx         # Template React Email pour le formulaire de contact
│
├── supabase/
│   ├── migrations/                     # Fichiers SQL versionés et committés dans git
│   ├── seed.sql                        # Données de test / démonstration
│   └── config.toml                     # Configuration Supabase CLI
│
├── middleware.ts                       # Session refresh Supabase + protection des routes dashboard
│
├── messages/
│   ├── fr.json                         # Traductions français (next-intl)
│   └── en.json                         # Traductions anglais (next-intl)
│
└── tests/
    ├── unit/                           # Tests Vitest + React Testing Library
    └── e2e/                            # Tests Playwright (flux complets avec Supabase local)
```

**Structure Decision**: Next.js App Router avec Route Groups `(public)`, `(auth)`, `(dashboard)`. Architecture full-stack monorepo — les Server Actions remplacent une API REST séparée. Déployable sur VPS self-hosted (Docker + Coolify/Caprover) ou Vercel.

---

## Complexity Tracking

> Aucune violation de la constitution non justifiée.
