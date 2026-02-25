<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0 (initial ratification)
Added sections:
  - Core Principles (I → V)
  - Stack & Architecture
  - Development Workflow
  - Governance
Templates requiring updates:
  ✅ constitution.md — this file
  ⚠ .specify/templates/plan-template.md — verify Constitution Check section references these principles
  ⚠ .specify/templates/spec-template.md — verify scope/requirements align
  ⚠ .specify/templates/tasks-template.md — verify task types reflect principles (TypeScript, i18n, accessibility)
Follow-up TODOs: none
-->

# Proxiwave Constitution

## Core Principles

### I. Intégration sans friction
L'IA et les nouvelles fonctionnalités DOIVENT s'intégrer aux outils et process existants des utilisateurs —
jamais l'inverse. Toute feature qui impose un changement de comportement non justifié est refusée.
Chaque composant DOIT être utilisable sans formation préalable.

**Rationale**: C'est la promesse centrale de Proxiwave — « On ne vous demande pas de changer. On s'adapte. »

### II. Résultats mesurables en priorité
Toute fonctionnalité DOIT être liée à un indicateur de résultat concret (temps gagné, taux de conversion,
délai de livraison). Les features décoratives sans impact mesurable sont à éviter.
Le délai cible pour des résultats visibles est de 4 semaines maximum par livrable.

**Rationale**: La valeur de Proxiwave se mesure. Les clients attendent des preuves, pas des promesses.

### III. TypeScript strict, zéro `any`
Tout le code DOIT être typé avec TypeScript. L'usage de `any` est interdit sans justification explicite
en commentaire. Les interfaces et types DOIVENT être définis dans des fichiers dédiés quand ils sont
partagés entre composants.

**Rationale**: La maintenabilité à long terme et la fiabilité du dashboard client l'exigent.

### IV. Composants autonomes et réutilisables
Chaque composant React DOIT être autonome, indépendamment testable, et libre de dépendances implicites
avec ses voisins. Les données DOIVENT transiter par props ou context — jamais par couplage direct.
Le pattern `bento-block` existant DOIT être respecté pour toute nouvelle section de la landing.

**Rationale**: Le projet évolue vite. La réutilisabilité réduit la dette technique et accélère les
itérations.

### V. Accessibilité, Performance & Responsive
Toutes les pages DOIVENT être entièrement responsive (mobile-first). Les images DOIVENT avoir des
attributs `alt`. Les boutons DOIVENT avoir des `aria-label` explicites. Les animations Framer Motion
DOIVENT respecter `prefers-reduced-motion`. Les Core Web Vitals (LCP, CLS, FID) DOIVENT rester dans
les seuils « Good » de Google.

**Rationale**: Les clients de Proxiwave accèdent au dashboard depuis mobile. Une mauvaise expérience
nuit directement à la relation client.

## Stack & Architecture

**Stack principale**: React 18 · TypeScript 5.6 · Vite 6 · Tailwind CSS 3 · Framer Motion 11 ·
React Router 7 · i18next (FR + EN) · Lucide React

**Structure des routes**:
- `/` — Landing page publique (Header, Hero, Approach, Results, Process, Contact, Footer)
- `/dashboard` — Interface client (projets en cours, messages)
- `/dashboard/project/:id` — Détail d'un projet (sprints, livrables, idées, messages)

**Internationalisation**: Toutes les chaînes visibles DOIVENT passer par `useTranslation()` et être
définies dans `src/i18n/locales/fr.json` et `en.json`. Aucune chaîne en dur dans les composants.

**Données**: Les données mock sont dans `src/dashboard/mockData.ts` et `projectDetailData.ts`.
Toute nouvelle entité DOIT y être définie avec une interface TypeScript.

## Development Workflow

**Branches**: `main` est la branche de production. Toute modification passe par une branche feature
puis PR (ou commit direct si changement mineur et Sylvain seul).

**Build**: `npm run build` (tsc + vite build) DOIT passer sans erreur TypeScript avant tout merge.
`npm run lint` DOIT passer sans warning bloquant.

**Commits**: Messages en français ou anglais, préfixés par type : `feat:`, `fix:`, `refactor:`,
`docs:`, `style:`, `chore:`.

**Review**: Pour tout changement impactant la landing page (Hero, Approach, Results), une prévisualisation
visuelle DOIT être vérifiée avant merge.

## Governance

Cette constitution est la référence absolue pour les décisions d'architecture et de design du projet.
Elle prime sur toute convention implicite ou préférence ponctuelle.

**Amendements**: Tout amendement DOIT être documenté dans ce fichier avec un bump de version sémantique
et la date du jour. Les changements MAJEURS (suppression ou redéfinition d'un principe) requièrent
une revue explicite de Sylvain Saillard.

**Conformité**: Chaque PR ou session de développement DOIT vérifier la conformité aux principes I à V.
En cas de doute, la question DOIT être posée avant l'implémentation.

**Version**: 1.0.0 | **Ratifiée**: 2026-02-20 | **Dernière modification**: 2026-02-20
