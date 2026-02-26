# Tasks: Proxiwave v2 — Plateforme de gestion de projets IA

**Input**: Design documents from `/specs/001-proxiwave-v2/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/ ✅ quickstart.md ✅

**Design constraint**: L'UI/UX du prototype (`/Users/sylvain/Proxiwave v2.1/src/`) est **gelée et validée**. Toutes les tâches UI consistent à **porter les composants existants** vers le nouveau repo en remplaçant les mockData par des données Supabase réelles. Aucune modification visuelle.

**Database**: Supabase Cloud — project ref `rteuevldfahmxsnafexa`

**No tests** — tests non demandés dans la spec, non inclus.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Parallélisable (fichiers différents, pas de dépendance sur une tâche incomplète)
- **[Story]**: User Story concernée (US1–US6)

---

## Phase 1: Setup — Nouveau repo Next.js 15

**But**: Créer le projet dans un nouveau dossier `proxiwave-v2/`, configurer les outils, copier les assets visuels du prototype.

- [ ] T001 Initialiser le projet Next.js 15 avec `create-next-app` dans `proxiwave-v2/` — options : `--typescript --tailwind --app --src-dir --import-alias "@/*"`
- [ ] T002 Installer les dépendances dans `proxiwave-v2/` : `@supabase/supabase-js @supabase/ssr next-intl framer-motion lucide-react resend @react-email/components`
- [ ] T003 [P] Configurer TypeScript strict dans `proxiwave-v2/tsconfig.json` — activer `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`
- [ ] T004 [P] Configurer Tailwind dans `proxiwave-v2/tailwind.config.ts` — copier exactement la palette du prototype (variables `pw-*`, `cream`, `warm-*`, couleurs custom, `fontFamily`, `borderRadius`, animations) depuis le `tailwind.config` du prototype
- [ ] T005 [P] Créer la structure de dossiers dans `proxiwave-v2/src/` : `app/(public)/`, `app/(auth)/`, `app/(dashboard)/`, `components/ui/`, `components/landing/`, `components/dashboard/`, `components/project/`, `lib/supabase/`, `types/`, `emails/`, `messages/`, `tests/unit/`, `tests/e2e/`
- [ ] T006 [P] Copier les fichiers de traduction depuis le prototype vers `proxiwave-v2/messages/fr.json` et `messages/en.json` (source : `src/i18n/locales/fr.json` et `en.json`)
- [ ] T007 [P] Configurer next-intl dans `proxiwave-v2/` — créer `i18n.ts` (locale depuis cookie `NEXT_LOCALE` ou `Accept-Language`) et mettre à jour `next.config.ts` avec `createNextIntlPlugin`
- [ ] T008 Initialiser Supabase CLI dans `proxiwave-v2/` avec `supabase init` puis lier au projet Cloud : `supabase link --project-ref rteuevldfahmxsnafexa`

---

## Phase 2: Foundational — Nettoyage Supabase + Schéma + Infra partagée

**But**: Nettoyer le projet Supabase Cloud, appliquer le schéma complet, créer toute l'infrastructure partagée (clients Supabase, middleware, design system de base).

**⚠️ CRITIQUE**: Aucune User Story ne peut démarrer avant la fin de cette phase.

### 2a — Nettoyage Supabase Cloud (⚠️ DESTRUCTIF — exécuter en premier)

- [ ] T009 Créer `proxiwave-v2/supabase/scripts/drop-all.sql` — script SQL qui supprime toutes les tables existantes (`DROP TABLE IF EXISTS ... CASCADE`) et toutes les fonctions publiques existantes du projet `rteuevldfahmxsnafexa`
- [ ] T010 Exécuter `drop-all.sql` sur le projet Supabase Cloud `rteuevldfahmxsnafexa` via le SQL Editor du Dashboard (https://supabase.com/dashboard/project/rteuevldfahmxsnafexa/sql) et vérifier que la liste des tables est vide
- [ ] T011 Vérifier et supprimer toutes les Edge Functions existantes du projet `rteuevldfahmxsnafexa` via `supabase functions list` (lié au projet) et `supabase functions delete <name>` pour chacune

### 2b — Migrations schema

- [ ] T012 Créer `proxiwave-v2/supabase/migrations/20260224_001_initial_schema.sql` — 11 tables complètes d'après `specs/001-proxiwave-v2/data-model.md` : `clients`, `profiles`, `projects`, `project_members`, `tasks`, `subtasks`, `sprints`, `sprint_items`, `ideas`, `project_messages`, `documents`, `contacts` + tous les index définis dans data-model.md
- [ ] T013 Créer `proxiwave-v2/supabase/migrations/20260224_002_helper_functions.sql` — fonctions SQL `public.get_my_role()`, `public.get_my_client_id()`, `public.can_access_project(UUID)` avec attributs `STABLE SECURITY DEFINER` d'après `data-model.md`
- [ ] T014 Créer `proxiwave-v2/supabase/migrations/20260224_003_rls_policies.sql` — copier exactement le contenu de `specs/001-proxiwave-v2/contracts/rls-policies.sql` (enable RLS + toutes les policies pour les 11 tables)
- [ ] T015 Appliquer les 3 migrations via `supabase db push` (depuis `proxiwave-v2/`) et vérifier dans le Dashboard Supabase que les tables, fonctions et policies sont bien créées
- [ ] T016 Configurer le bucket Storage `documents` dans le projet `rteuevldfahmxsnafexa` — créer le bucket (non-public), ajouter une policy Storage pour permettre au superadmin d'uploader et à tous les utilisateurs authentifiés de télécharger
- [ ] T017 Générer les types TypeScript via `supabase gen types typescript --linked > proxiwave-v2/src/types/database.ts`

### 2c — Infrastructure code

- [ ] T018 [P] Créer `proxiwave-v2/src/lib/supabase/server.ts` — `createClient()` async avec `cookies()` async (Next.js 15), d'après le pattern de `specs/001-proxiwave-v2/quickstart.md` section 5
- [ ] T019 [P] Créer `proxiwave-v2/src/lib/supabase/client.ts` — `createClient()` sync avec `createBrowserClient()` pour Client Components uniquement
- [ ] T020 [P] Créer `proxiwave-v2/src/lib/supabase/admin.ts` — `supabaseAdmin` avec service role key, attribut `persistSession: false` — ajouter commentaire `// NEVER import in Client Components`
- [ ] T021 Créer `proxiwave-v2/src/middleware.ts` — session refresh Supabase + redirection `/login` si non authentifié sur routes `/dashboard/*`, d'après le pattern de `specs/001-proxiwave-v2/quickstart.md` section 6 ; retourner `supabaseResponse` (jamais `NextResponse.next()`)
- [ ] T022 [P] Créer `proxiwave-v2/src/types/app.ts` — tous les types partagés définis dans `specs/001-proxiwave-v2/contracts/server-actions.md` section "Types TypeScript partagés" : `UserRole`, `ProjectStatus`, `TaskStatus`, `TaskPriority`, `SprintStatus`, `SprintItemStatus`, `IdeaStatus`, `FileType`, `DocumentCategory`, `MessageType`
- [ ] T023 [P] Créer `proxiwave-v2/src/lib/utils.ts` — helper `cn()` (clsx + tailwind-merge), `formatDate()`, `formatFileSize()`, `getInitials()`

### 2d — Design system primitives

- [ ] T024 [P] Porter les primitives UI dans `proxiwave-v2/src/components/ui/` depuis le prototype — identifier dans `src/` du prototype tous les composants UI réutilisables (boutons, badges, avatars, cartes, barres de progression, spinners) et les copier en remplaçant les imports mockData par des props TypeScript
- [ ] T025 [P] Créer `proxiwave-v2/src/components/ui/EmptyState.tsx` — composant état vide réutilisable (icône + titre + description + CTA optionnel), style cohérent avec le design system du prototype
- [ ] T026 [P] Créer `proxiwave-v2/src/app/globals.css` — copier les variables CSS custom du prototype (polices, couleurs CSS variables pw-*, cream, warm-*) et les directives Tailwind

**Checkpoint**: Schema BDD prêt, RLS actives, infra code en place — les User Stories peuvent démarrer.

---

## Phase 3: User Story 1 — Accès sécurisé à la plateforme (Priority: P1) 🎯 MVP

**Goal**: Connexion/déconnexion fonctionnelle, redirection par rôle (superadmin/admin_client/chef_de_projet), protection de toutes les routes dashboard.

**Independent Test**: Créer 3 comptes via `supabaseAdmin` (superadmin, admin_client, chef_de_projet), se connecter avec chacun, vérifier les redirections et que le dashboard est inaccessible sans auth.

- [ ] T027 [US1] Créer `proxiwave-v2/src/app/(auth)/login/actions.ts` — Server Action `login(formData)` : appelle `supabase.auth.signInWithPassword()`, redirige vers `/dashboard` en succès, retourne `{ error }` en échec (message générique, ne révèle pas email vs mot de passe)
- [ ] T028 [US1] Créer `proxiwave-v2/src/app/(auth)/login/page.tsx` — page de connexion avec formulaire email/password ; porter le style visuel du prototype (logo Proxiwave, palette pw-*, layout centré) ; afficher le message d'erreur si présent
- [ ] T029 [US1] Créer `proxiwave-v2/src/app/auth/callback/route.ts` — Route Handler GET qui appelle `supabase.auth.exchangeCodeForSession()` et redirige vers `/dashboard`
- [ ] T030 [US1] Créer `proxiwave-v2/src/app/(dashboard)/actions.ts` — Server Action `logout()` : appelle `supabase.auth.signOut()` et redirige vers `/login`
- [ ] T031 [US1] Porter `proxiwave-v2/src/components/dashboard/Sidebar.tsx` depuis `src/dashboard/Sidebar.tsx` du prototype — remplacer les liens hardcodés par une navigation dynamique selon le rôle (`useRole()` hook depuis profil Supabase) ; brancher le bouton "Déconnexion" sur la Server Action `logout()`
- [ ] T032 [US1] Créer `proxiwave-v2/src/app/(dashboard)/layout.tsx` — Auth guard : `await createClient()` + `supabase.auth.getUser()` → redirect `/login` si non authentifié ; charger le profil utilisateur (rôle, nom) et passer en contexte ; inclure `<Sidebar />`
- [ ] T033 [US1] Créer `proxiwave-v2/src/app/(public)/layout.tsx` — Layout minimal pour les routes publiques (landing, pas d'auth requise)
- [ ] T034 [US1] Créer `proxiwave-v2/src/app/not-found.tsx` — page 404 stylée avec le design system du prototype + lien retour
- [ ] T035 [US1] Créer un script de seed initial `proxiwave-v2/supabase/seed.sql` — insérer 1 client, 1 compte superadmin (via `auth.users` + `profiles`), 1 admin_client, 1 chef_de_projet pour valider les 3 flux de connexion

**Checkpoint**: Les 3 rôles peuvent se connecter/déconnecter. Le dashboard est inaccessible sans auth. Chaque rôle voit son espace approprié.

---

## Phase 4: User Story 2 — Tableau de bord projets (Priority: P2)

**Goal**: Dashboard avec liste des projets filtrée par rôle (RLS), statistiques agrégées, panneau messages récents, toggle grille/liste, recherche temps réel.

**Independent Test**: Insérer 3 projets (2 en cours, 1 terminé) pour le client de test. Se connecter avec superadmin → voir les 3 projets. Se connecter avec chef_de_projet assigné à 1 seul → voir 1 projet. Vérifier les compteurs.

- [ ] T036 [US2] Créer `proxiwave-v2/src/app/(dashboard)/dashboard/actions.ts` — Server Actions : `listProjects()` (SELECT depuis Supabase, RLS applique le filtre par rôle) et `getDashboardStats()` (COUNT par statut depuis projets accessibles) et `getRecentMessages()` (derniers messages tous projets accessibles, avec projet associé)
- [ ] T037 [P] [US2] Porter `proxiwave-v2/src/components/dashboard/StatsBar.tsx` depuis le prototype — 4 compteurs (En cours / Terminés / À venir / Total) ; remplacer les valeurs mockData par des props `stats: DashboardStats`
- [ ] T038 [P] [US2] Porter `proxiwave-v2/src/components/dashboard/ProjectCard.tsx` (vue grille) depuis le prototype — remplacer les données mock par des props `project: Project` ; conserver exactement le layout bento-card, la barre de progression, les avatars équipe, le badge statut
- [ ] T039 [P] [US2] Porter `proxiwave-v2/src/components/dashboard/ProjectRow.tsx` (vue liste) depuis le prototype — même principe que T038 avec le layout ligne
- [ ] T040 [P] [US2] Porter `proxiwave-v2/src/components/dashboard/MessagesPanel.tsx` depuis le prototype — remplacer les données mock par des props `messages: DashboardMessage[]` ; conserver le style visuel (avatar, prévisualisation, horodatage)
- [ ] T041 [P] [US2] Créer `proxiwave-v2/src/components/dashboard/SearchBar.tsx` — composant Client Component avec `useState` pour le filtre texte en temps réel sur `name` et `category` ; même style que le prototype
- [ ] T042 [US2] Créer `proxiwave-v2/src/app/(dashboard)/dashboard/page.tsx` — Server Component : appelle `listProjects()`, `getDashboardStats()`, `getRecentMessages()` ; passe les données aux composants `StatsBar`, `ProjectCard`/`ProjectRow`, `MessagesPanel` ; inclure le toggle grille/liste (`'use client'` wrapper léger pour l'état local)

**Checkpoint**: Dashboard opérationnel avec données réelles. Les 3 rôles voient leurs projets respectifs. Statistiques exactes. Recherche fonctionnelle.

---

## Phase 5: User Story 3 — Suivi détaillé d'un projet (Priority: P2)

**Goal**: Page détail projet avec Gantt hebdomadaire, panneau tâche au clic, onglets Sprints/Documents/Idées/Messages/Tâches, KPI tabs, jauge de progression.

**Independent Test**: Insérer un projet complet (5 tâches avec sous-tâches, 2 sprints, 3 documents, 2 idées, 2 messages). Naviguer vers le projet → vérifier que tous les onglets affichent les bonnes données.

- [ ] T043 [US3] Créer `proxiwave-v2/src/app/(dashboard)/dashboard/project/[id]/actions.ts` — Server Actions : `getProject(id)` (retourne null si RLS bloque l'accès), `listTasks(projectId)` avec sous-tâches, `listSprints(projectId)` avec items
- [ ] T044 [P] [US3] Porter `proxiwave-v2/src/components/project/ProjectHeader.tsx` depuis le prototype — jauge circulaire de progression (SVG ou librairie), score satisfaction, KPI tabs cliquables (Idées / Messages / Tâches / Sprints / Documents) avec compteurs ; props : `project: ProjectDetail`, `activeTab`, `onTabChange`
- [ ] T045 [P] [US3] Porter `proxiwave-v2/src/components/project/GanttChart.tsx` depuis le prototype — diagramme de Gantt hebdomadaire ; remplacer les données mock par des props `tasks: Task[]` ; conserver exactement le rendu visuel (barres colorées par statut, semaines en abscisse, progression)
- [ ] T046 [US3] Porter `proxiwave-v2/src/components/project/TaskDetailPanel.tsx` depuis le prototype — panneau latéral qui s'ouvre au clic sur une tâche Gantt ; afficher : titre, description, sous-tâches (cases à cocher), priorité badge, assigné avatar, sprint, dates début/fin, tags, barre de progression ; props : `task: Task | null`, `onClose`
- [ ] T047 [P] [US3] Porter `proxiwave-v2/src/components/project/SprintCard.tsx` et `SprintItemList.tsx` depuis le prototype — carte sprint avec statut, dates, progression, montant de facturation, liste des items avec statut ; props : `sprint: Sprint`
- [ ] T048 [P] [US3] Porter `proxiwave-v2/src/components/project/ProjectDocumentsTab.tsx` depuis le prototype — liste des documents d'un projet (icône type fichier, catégorie badge, taille, date, bouton téléchargement, favori étoile) ; utilise `listDocuments({ project_id })` passé en props
- [ ] T049 [US3] Créer `proxiwave-v2/src/app/(dashboard)/dashboard/project/[id]/page.tsx` — Server Component : `getProject(id)` → redirect `/dashboard` si null (accès refusé) ; `listTasks()`, `listSprints()` ; passer toutes les données aux composants via props ; gérer le `activeTab` state côté client ; inclure `GanttChart`, `TaskDetailPanel`, `SprintCard`, onglets Idées/Messages/Documents

**Checkpoint**: Page projet complète avec données réelles. Gantt interactif. Tous les onglets fonctionnels. Accès refusé redirige correctement.

---

## Phase 6: User Story 4 — Boîte à idées collaborative (Priority: P3)

**Goal**: Les clients (admin_client, chef_de_projet) soumettent des idées ; le superadmin change leur statut ; les statistiques d'adoption s'affichent en temps réel.

**Independent Test**: Connecté en admin_client → soumettre une idée → se connecter en superadmin → changer le statut → se reconnecter en admin_client → vérifier le statut mis à jour + compteurs.

- [ ] T050 [US4] Créer `proxiwave-v2/src/app/(dashboard)/dashboard/project/[id]/ideas/actions.ts` — Server Actions : `listIdeas(projectId)` avec statistiques agrégées, `createIdea({ project_id, title })` (accès : admin_client + chef_de_projet, author_id = auth.uid()), `updateIdeaStatus(id, status)` (accès : superadmin uniquement, validation des transitions)
- [ ] T051 [P] [US4] Porter `proxiwave-v2/src/components/project/IdeaStats.tsx` depuis le prototype — compteurs par statut (Nouvelles / En revue / Acceptées / Refusées) + taux d'adoption calculé ; props : `stats: IdeaStats`
- [ ] T052 [P] [US4] Porter `proxiwave-v2/src/components/project/IdeaList.tsx` depuis le prototype — liste des idées avec statut badge, auteur, date ; le superadmin voit un sélecteur de statut (dropdown) ; les autres rôles voient le statut en lecture seule
- [ ] T053 [P] [US4] Porter `proxiwave-v2/src/components/project/IdeaSubmitForm.tsx` depuis le prototype — formulaire d'envoi d'idée (Client Component) ; visible uniquement pour admin_client et chef_de_projet ; appelle `createIdea()` via Server Action
- [ ] T054 [US4] Intégrer l'onglet Boîte à idées dans `proxiwave-v2/src/app/(dashboard)/dashboard/project/[id]/page.tsx` — ajouter `listIdeas()` dans les Server Actions appelées, passer données à `IdeaStats`, `IdeaList`, `IdeaSubmitForm` ; connecter `updateIdeaStatus()` sur le dropdown superadmin

**Checkpoint**: Les clients soumettent des idées. Le superadmin change les statuts. Les compteurs reflètent les données réelles.

---

## Phase 7: User Story 5 — Messagerie projet (Priority: P3)

**Goal**: Fil de messages dans le contexte projet, différenciation visuelle client (gauche) / équipe (droite), panneau messages du dashboard mis à jour.

**Independent Test**: Connecté en admin_client → envoyer un message → se connecter en superadmin → voir le message dans le projet ET dans le panneau messages du dashboard.

- [ ] T055 [US5] Créer `proxiwave-v2/src/app/(dashboard)/dashboard/project/[id]/messages/actions.ts` — Server Actions : `listMessages(projectId)` triés par date ASC avec profil auteur (nom, initiales, couleur), `sendMessage({ project_id, content })` (tous rôles ; message_type déduit du rôle côté serveur)
- [ ] T056 [P] [US5] Porter `proxiwave-v2/src/components/project/MessageThread.tsx` depuis le prototype — fil de messages avec alignement dynamique (messages `client` à gauche, `équipe` à droite) ; avatar coloré, nom, horodatage ; props : `messages: ProjectMessage[]`, `currentUserId: string`
- [ ] T057 [P] [US5] Porter `proxiwave-v2/src/components/project/MessageInput.tsx` depuis le prototype — textarea + bouton envoi (Client Component) ; appelle `sendMessage()` via Server Action ; vider le champ après envoi réussi ; props : `projectId: string`
- [ ] T058 [US5] Intégrer l'onglet Messages dans `proxiwave-v2/src/app/(dashboard)/dashboard/project/[id]/page.tsx` — ajouter `listMessages()` dans les Server Actions appelées, passer données à `MessageThread` et `MessageInput` ; s'assurer que `MessagesPanel` du dashboard (T040) appelle `getRecentMessages()` qui inclut les nouveaux messages

**Checkpoint**: Les messages s'affichent côté client ET côté équipe. Le panneau dashboard reflète les derniers messages.

---

## Phase 8: User Story 6 — Gestion globale des documents (Priority: P3)

**Goal**: Vue centralisée de tous les documents (tous projets), filtres, upload (superadmin), téléchargement, favoris persistés.

**Independent Test**: Uploader 2 documents sur des projets différents via la Server Action → vérifier la vue globale → filtrer par catégorie → télécharger → cocher favori → recharger et vérifier la persistance.

- [ ] T059 [US6] Créer `proxiwave-v2/src/app/(dashboard)/documents/actions.ts` — Server Actions : `listDocuments(filters)` avec filtres `project_id`, `category`, `file_type`, `search` (recherche sur `name`), `uploadDocument(formData)` (upload Supabase Storage dans `documents/{project_id}/{uuid}-{filename}` puis INSERT BDD), `deleteDocument(id)` (Storage + BDD), `toggleDocumentFavorite(id)` (UPDATE `is_favorite`)
- [ ] T060 [P] [US6] Porter `proxiwave-v2/src/components/dashboard/DocumentCard.tsx` depuis `src/dashboard/DocumentsView.tsx` du prototype — icône selon `file_type`, badge `category`, taille formatée, date, bouton téléchargement (lien signé Supabase Storage via `createSignedUrl()`), étoile favori toggle
- [ ] T061 [P] [US6] Porter `proxiwave-v2/src/components/dashboard/DocumentFilters.tsx` depuis le prototype — filtres par catégorie (dropdown), type de fichier (dropdown), recherche textuelle (input) ; Client Component avec état local ; callback `onFiltersChange`
- [ ] T062 [P] [US6] Créer `proxiwave-v2/src/components/dashboard/DocumentUploadForm.tsx` — formulaire upload (input file + project_id + category) ; visible uniquement pour superadmin ; appelle `uploadDocument()` via Server Action ; afficher progression et message d'erreur si échec
- [ ] T063 [US6] Créer `proxiwave-v2/src/app/(dashboard)/documents/page.tsx` — Server Component : `listDocuments()` ; inclure `DocumentFilters` (Client Component), `DocumentCard` liste, `DocumentUploadForm` (superadmin uniquement) ; grouper les documents par projet dans l'affichage

**Checkpoint**: Vue globale opérationnelle. Upload → Storage → BDD → affichage. Filtres fonctionnels. Téléchargement via URL signée. Favoris persistés.

---

## Phase 9: Landing page & Contact

**But**: Porter fidèlement la landing page du prototype avec le formulaire de contact fonctionnel (persistance Supabase + email Resend).

- [ ] T064 [P] Porter `proxiwave-v2/src/components/landing/Header.tsx` et `Footer.tsx` depuis le prototype — bouton "Se connecter" redirige vers `/login` ; conserver exactement le layout, les animations Framer Motion, les couleurs
- [ ] T065 [P] Porter `proxiwave-v2/src/components/landing/Hero.tsx` depuis le prototype — section hero avec headline, sous-titre, CTA ; animations Framer Motion `prefers-reduced-motion` conformes
- [ ] T066 [P] Porter `proxiwave-v2/src/components/landing/Approach.tsx`, `Results.tsx` et `Process.tsx` depuis le prototype — conserver exactement le pattern bento-block, les icônes Lucide, les couleurs pw-*
- [ ] T067 [P] Porter `proxiwave-v2/src/components/landing/Contact.tsx` depuis le prototype — formulaire nom/email/message (Client Component) ; appelle `POST /api/contact` ; afficher confirmation visuelle après envoi ; conserver le style du prototype
- [ ] T068 Créer `proxiwave-v2/src/app/api/contact/route.ts` — Route Handler POST : valider les inputs, INSERT dans table `contacts` via `supabaseAdmin`, envoyer email de notification via Resend (`RESEND_API_KEY`) vers l'adresse équipe Proxiwave, retourner `{ success: true }`
- [ ] T069 [P] Créer `proxiwave-v2/src/emails/ContactNotification.tsx` — template React Email avec nom, email, message du contact ; utilisé par T068
- [ ] T070 Créer `proxiwave-v2/src/app/(public)/page.tsx` — assembler toutes les sections de la landing dans l'ordre du prototype : Header, Hero, Approach, Results, Process, Contact, Footer

---

## Phase 10: Polish & Cross-Cutting Concerns

**But**: Finaliser l'internationalisation, les états d'erreur, l'accessibilité, et valider la checklist quickstart.

- [ ] T071 [P] Compléter `proxiwave-v2/messages/fr.json` et `en.json` — s'assurer que toutes les chaînes visibles dans les nouveaux composants (US1–US6 + landing) sont externalisées via `useTranslations()` ; aucune chaîne hardcodée
- [ ] T072 [P] Vérifier l'accessibilité dans tous les composants interactifs — ajouter `aria-label` sur tous les boutons icônes, `alt` sur toutes les images, vérifier les rôles ARIA sur les composants Gantt et KPI tabs (Constitution V)
- [ ] T073 [P] Créer `proxiwave-v2/src/app/error.tsx` — page d'erreur globale Next.js stylée avec le design system du prototype ; bouton "Retour au dashboard"
- [ ] T074 [P] Créer `proxiwave-v2/src/app/(dashboard)/dashboard/project/[id]/not-found.tsx` — page accès refusé au projet (pour redirections RLS) ; message clair sans révéler l'existence du projet
- [ ] T075 Compléter `proxiwave-v2/supabase/seed.sql` avec des données de démonstration réalistes — 1 client "Acme Corp", 2 projets (1 en cours avec 5 tâches + sous-tâches + 2 sprints + 3 documents + 2 idées + 3 messages, 1 terminé), 3 utilisateurs (1 superadmin, 1 admin_client, 1 chef_de_projet assigné au 1er projet)
- [ ] T076 Valider le projet en suivant la checklist de `specs/001-proxiwave-v2/quickstart.md` — s'assurer que chaque item de la checklist "avant premier commit" est coché ; corriger les écarts éventuels

---

## Dependencies & Execution Order

### Dépendances entre phases

```
Phase 1 (Setup)
    │
    └──> Phase 2 (Foundational) ──────────────────────────────────────────┐
              │                                                            │
              ├──> Phase 3 (US1 Auth) ────────────────────> Phase 4–8    │
              │    (MVP minimal — connexion + routing)                     │
              ├──> Phase 4 (US2 Dashboard) ─────────────> Phase 5         │
              ├──> Phase 5 (US3 Détail Projet) ──> Phase 6,7,8            │
              ├──> Phase 6 (US4 Idées) ─── indépendante après US3         │
              ├──> Phase 7 (US5 Messages) ─ indépendante après US3        │
              ├──> Phase 8 (US6 Documents) ─ indépendante après US3       │
              └──> Phase 9 (Landing) ─── indépendante de US1–US6          │
                                                                           │
Phase 10 (Polish) ──────────────────────────────────────────────────────┘
```

### User Story Dependencies

- **US1 (P1)**: Dépend de Phase 2 uniquement — démarre en premier
- **US2 (P2)**: Dépend de US1 (layout + sidebar déjà en place)
- **US3 (P2)**: Dépend de US2 (navigation depuis le dashboard)
- **US4 (P3)**: Dépend de US3 (s'intègre dans la page projet)
- **US5 (P3)**: Dépend de US3 (s'intègre dans la page projet) — **parallélisable avec US4**
- **US6 (P3)**: Dépend de US2 (navigation dashboard) — **parallélisable avec US4 et US5**
- **Landing (Phase 9)**: Indépendante de toutes les US — **parallélisable avec US4/US5/US6**

### Au sein de chaque User Story

```
Server Actions → Composants UI (portés depuis prototype) → Intégration dans la page
```

---

## Parallel Example: Phase 2 (Foundational)

```
Sequential (bloquant):   T009 → T010 → T011 → T012 → T013 → T014 → T015 → T016 → T017
Parallel (après T017):   T018 ║ T019 ║ T020     (lib/supabase/*.ts)
                         T021                   (middleware.ts)
                         T022 ║ T023            (types/app.ts, utils.ts)
                         T024 ║ T025 ║ T026     (design system)
```

## Parallel Example: Phase 5 (US3 Détail Projet)

```
T043 (actions.ts)
    │
    ├── T044 [P] ProjectHeader.tsx
    ├── T045 [P] GanttChart.tsx
    ├── T047 [P] SprintCard.tsx
    └── T048 [P] ProjectDocumentsTab.tsx
    │
T046 TaskDetailPanel.tsx (dépend de T045 pour l'événement onClick)
    │
T049 page.tsx (intégration — dépend de tous les composants)
```

---

## Implementation Strategy

### MVP First (US1 uniquement)

1. Compléter Phase 1 (Setup)
2. Compléter Phase 2 (Foundational) — critique, bloque tout
3. Compléter Phase 3 (US1 Auth)
4. **STOP & VALIDER** : les 3 rôles se connectent, le dashboard est protégé
5. Démo possible avec données seed

### Incremental Delivery

```
Phase 1+2 → Foundation opérationnelle
Phase 3    → MVP : Auth + routing par rôle ← DEMO 1
Phase 4    → Dashboard avec projets réels  ← DEMO 2
Phase 5    → Détail projet complet         ← DEMO 3
Phase 6+7+8 → Idées + Messages + Documents ← DEMO 4 (parallélisables)
Phase 9    → Landing + Contact             ← parallèle avec DEMO 4
Phase 10   → Polish + seed complet         ← DEMO finale
```

### Stratégie multi-agents

```
Après Phase 2 complète :
  Agent A : Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3)
  Agent B : Phase 9 (Landing) — entièrement indépendante

Après Phase 5 complète :
  Agent A : Phase 6 (US4 Idées)
  Agent B : Phase 7 (US5 Messages)
  Agent C : Phase 8 (US6 Documents)
```

---

## Notes

- `[P]` = fichiers différents, aucune dépendance sur une tâche en cours → lancement en parallèle possible
- Chaque tâche UI **porte depuis le prototype** — ne pas recréer de composants visuellement différents
- La clé de chaque tâche UI : "copier le rendu visuel, remplacer les données mock par des props Supabase"
- Committer après chaque phase ou groupe logique
- S'arrêter aux checkpoints pour valider chaque story indépendamment
- `SUPABASE_SERVICE_ROLE_KEY` : uniquement dans `lib/supabase/admin.ts`, jamais importé côté client
- `supabase.auth.getUser()` côté serveur — jamais `getSession()`
- `await cookies()` dans Next.js 15 — ne pas oublier le `await`

---

## Résumé

| Phase | Story | Tâches | Parallélisables |
|-------|-------|--------|-----------------|
| Phase 1 : Setup | — | T001–T008 | T003–T008 (6/8) |
| Phase 2 : Foundational | — | T009–T026 | T018–T026 (9/18) |
| Phase 3 : US1 Auth | US1 | T027–T035 | 0 (séquentiel) |
| Phase 4 : US2 Dashboard | US2 | T036–T042 | T037–T041 (5/7) |
| Phase 5 : US3 Détail | US3 | T043–T049 | T044–T048 (5/7) |
| Phase 6 : US4 Idées | US4 | T050–T054 | T051–T053 (3/5) |
| Phase 7 : US5 Messages | US5 | T055–T058 | T056–T057 (2/4) |
| Phase 8 : US6 Documents | US6 | T059–T063 | T060–T062 (3/5) |
| Phase 9 : Landing | — | T064–T070 | T064–T067, T069 (5/7) |
| Phase 10 : Polish | — | T071–T076 | T071–T074 (4/6) |
| **TOTAL** | | **76 tâches** | **~42 parallélisables** |
