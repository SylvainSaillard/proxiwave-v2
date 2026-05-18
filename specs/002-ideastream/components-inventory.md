# IdeaStream — Inventaire des composants à produire

> Périmètre : composants nécessaires pour livrer les **4 écrans Stitch en lecture seule** (Dashboard, Idea Wall, Idea Detail, Projects).
> Convention : composants en PascalCase, fichiers en `src/components/ideastream/<Domain>/<Name>.tsx`.
> Pour le MVP, tous les composants sont **présentationnels purs** — ils reçoivent leurs données en props depuis les Server Components qui fetchent les fixtures.

## Légende

- **🟢 réutilisable** : déjà existant dans `src/components/ui/` ou trivialement adaptable.
- **🟡 à refondre** : existe mais doit être revu pour la palette/typo v4.
- **🔴 nouveau** : à créer.

## Composants atomiques (UI primitives)

| Composant | Statut | Description | Props clés |
|---|---|---|---|
| `Button` | 🔴 | Pill, variants primary/secondary/ghost, sizes sm/md/lg, icône optionnelle | `variant`, `size`, `leadingIcon`, `onClick` |
| `Chip` | 🔴 | Pill arrondie, fond tinté + texte contrasté ; variants color (primary/secondary/tertiary/neutral) | `color`, `label`, `icon?` |
| `StatusBadge` | 🔴 | Spécialisation Chip : statuts idée ('Sandbox', 'Approved', 'In Dev', 'Shipped') avec mapping couleur | `status: IdeaStatus` |
| `CategoryChip` | 🔴 | Spécialisation Chip : catégorie idée (UI/UX, Backend, Mobile) | `category: IdeaCategory` |
| `Avatar` | 🟡 | Existe — adapter pour border indigo "online", size variants | `user`, `size`, `isActive` |
| `AvatarGroup` | 🔴 | Empilement overlap `-space-x-2`, dernier élément "+N" | `users[]`, `max=4`, `size` |
| `IconButton` | 🔴 | Bouton carré arrondi pour cloche, kebab, back arrow | `icon`, `ariaLabel`, `onClick` |
| `ProgressBar` | 🟡 | Existe — repalette teal pour fill positif, indigo pour neutre, hauteurs 8px | `value`, `color`, `height` |
| `ProgressRing` | 🟢 | Existe déjà | — |
| `FAB` | 🔴 | Bouton flottant rond secondary, ombre tintée, fixed bottom-right | `icon`, `label?`, `onClick` |
| `SearchInput` | 🔴 | Input avec icône search à gauche, fond slate-100 | `value`, `placeholder`, `onChange` |
| `EmptyState` | 🟢 | Existe — vérifier qu'il accepte la nouvelle palette | — |

## Composants de navigation

| Composant | Statut | Description |
|---|---|---|
| `Sidebar` (desktop) | 🟡 | Refonte complète : logo IdeaStream, liste de nav (Dashboard, Idea Wall, Projects, Team), CTA "+ New Idea", footer (Settings, Support). États actif/inactif. |
| `BottomTabBar` (mobile) | 🔴 | 4 items (Home, Ideas, Projects, Profile), tab actif en pill secondary, safe-area-inset-bottom |
| `TopAppBar` (desktop) | 🔴 | Logo + search globale + cloche + avatar |
| `MobileHeader` | 🔴 | Avatar (ou back arrow) + logo + cloche + chip XP optionnel |
| `NavItem` | 🔴 | Item de liste générique pour Sidebar et BottomTabBar (props `icon`, `label`, `href`, `isActive`) |

**Source unique** : `src/components/ideastream/navigation/navigation-items.ts` exporte le tableau d'items consommé par Sidebar et BottomTabBar.

## Composants Dashboard

| Composant | Statut | Description |
|---|---|---|
| `SparkAChangeHero` | 🔴 | Card gradient `from-#3525cd to-#8127cf`, titre display-lg, sous-titre, CTA `New Idea`, visuel sparkles à droite (desktop) |
| `InnovationJourneyCard` | 🔴 | Niveau actuel + level_title, XP bar avec milestone label (`450 / 500 XP`), pourcentage |
| `StatBlock` | 🔴 | Card sobre avec gros chiffre + label sous-titre. Variants : Streak (icône flamme), Total Badges (trophée), Ideas Contributed |
| `AchievementsList` | 🔴 | Card "Achievements" avec liste de `AchievementBadgeItem` + lien "View All" |
| `AchievementBadgeItem` | 🔴 | Icône circulaire colorée + titre + description courte |
| `TrendingIdeasSection` | 🔴 | Wrapper section : titre + sous-titre + lien "View All" + grid/carrousel de `IdeaCard` |
| `CommunityPulseFeed` | 🔴 | Liste de `PulseItem` avec scroll vertical, footer "Show more activity" |
| `PulseItem` | 🔴 | Avatar mini ou icône d'événement, ligne d'activité (`<actor> upvoted your idea "X"`), timestamp relatif. Variants par `verb` |
| `ContributionStreakWidget` | 🔴 | Carte flame icon + "N Days" + progress bar (dans la sidebar mobile Projects et en floating widget desktop Idea Wall) |

## Composants Idea Wall

| Composant | Statut | Description |
|---|---|---|
| `IdeaWallHeader` | 🔴 | Titre `Idea Wall` + sous-titre + bloc points droite (desktop), search bar (mobile) |
| `CategoryFilterBar` | 🔴 | Pills horizontales scrollables (`All Categories`, `UI/UX`, `Backend`, `Mobile`), variant actif primary-container |
| `IdeaCard` | 🔴 | **Composant central**. Border-left 4px (couleur statut), chips statut + catégorie, sprint badge, titre, description, AvatarGroup, UpvoteButton, kebab. Variant compact (Trending) et standard (Wall). |
| `UpvoteButton` | 🔴 | Icône thumb_up + count. État `voted` rempli (style `font-variation-settings: 'FILL' 1`), couleur secondary |
| `LoadMoreButton` | 🔴 | Bouton centré + label "Showing X of Y ideas" |
| `EmptyIdeaWall` | 🔴 | EmptyState spécialisé (illustration + CTA "Be the first to share an idea") |

## Composants Idea Detail

| Composant | Statut | Description |
|---|---|---|
| `IdeaDetailHeader` | 🔴 | Breadcrumbs (desktop) ou back arrow (mobile) + meta `GamificationEngine · Posted 2 days ago` |
| `LifecycleStepper` | 🔴 | 4 stages (Idea, Approval, Dev, Done) avec cercles + lignes + labels. Variants par état : complete (teal+check), active (purple+icon), pending (outline). Responsive : horizontal partout, taille adaptée. |
| `IdeaHero` | 🔴 | Titre `Neural-Feedback Rewards...` + chip statut "In Approval Queue" + UpvoteButton large |
| `DesignArtifactsList` | 🔴 | Section "Design Artifacts" + bouton "Add File" + liste de `ArtifactItem` |
| `ArtifactItem` | 🔴 | Vignette/icône type fichier (figma, image), nom, taille |
| `ExecutionContextPanel` | 🔴 | Card "Execution Context" : `LinkedProjectChip`, `SprintCycleChip`, `EstDeliveryChip`, `ComplexityScore` |
| `ComplexityScore` | 🔴 | Label + score `08/10` + slider visuel (read-only) |
| `TeamDiscussion` | 🔴 | Section titre + input "Add a collaborative thought..." + bouton "Post Contribution" + liste de `CommentThread` |
| `CommentThread` | 🔴 | Récursif (avatar + author + timestamp + content + bouton Reply + replies nested avec border-left). Pour MVP lecture, l'input est désactivé. |
| `ActivityHistoryTimeline` | 🔴 | Liste verticale de `TimelineItem` (icône action, texte court, timestamp), lien "View All Logs" |
| `TimelineItem` | 🔴 | Petite ligne d'historique (verbe + date relative) |

## Composants Projects Overview

| Composant | Statut | Description |
|---|---|---|
| `ProjectsHeader` | 🔴 | Tabs Active / Archived + search (desktop) ou titre + sous-titre count (mobile) |
| `InnovationCycleHero` | 🔴 | Card violette large : "Innovation Cycle #12", `VelocityScore`, ProgressBar tasks 14/18, AvatarGroup |
| `VelocityScore` | 🔴 | Gros chiffre `78%` + label "Velocity Score" |
| `InitiateSprintCard` | 🔴 | Card dashed border avec icône éclair + titre + CTA `Create New Sprint` |
| `ProjectCard` | 🔴 | Border-left 8px coloré, chip catégorie (`STRATEGIC`, `INTERNAL`, etc.), titre, description, ProgressBar, AvatarGroup, chevron-right |
| `GrowthInsightCard` | 🔴 | Card bento "Growth Insight" texte + icône trendup |
| `ProjectsContributionStreak` | 🔴 | Card bento "Contribution Streak" (réutilise `ContributionStreakWidget`) |
| `SprintWidgetMobile` | 🔴 | Sticky sidebar mobile : icône bolt + "Active Sprint" + idea chips (lightbulb/hub/style) + tâches X/Y + CTA "Open Sprint Board" + CTA "Daily Standup" |

## Composants partagés transverses

| Composant | Statut | Description |
|---|---|---|
| `Card` | 🟡 | Wrapper de base. Variants surface-container-low/lowest/highest, padding sm/md/lg, radius default/lg |
| `Section` | 🔴 | Wrapper sémantique avec titre + sous-titre + slot action droit (lien "View All") |
| `XPChip` | 🔴 | Pill compacte "2,450 Points" avec icône, utilisée dans le header mobile |
| `LevelBadge` | 🔴 | Badge "Level 14: Master Tinkerer" ou "Level 12: Visionary" |
| `RelativeTime` | 🔴 | Affichage `2h ago`, `1 hour ago` (intl.RelativeTimeFormat) |
| `NotificationBell` | 🔴 | Icône + dot si non-lus (MVP : pas de panel, juste l'icône) |

## Estimation par écran (lecture seule)

| Écran | Nb composants spécifiques | Réutilisable | Charge estimée |
|---|---|---|---|
| Setup (palette, typo, Card, Chip, Button, Avatar*) | 12 atomiques | — | ~1.5 j |
| Navigation (Sidebar, BottomTabBar, headers) | 5 | — | ~1 j |
| Dashboard | 9 spécifiques | Card, Chip, ProgressBar, AvatarGroup | ~2 j |
| Idea Wall | 6 spécifiques | IdeaCard mutualisé avec Dashboard | ~1.5 j |
| Idea Detail | 11 spécifiques | Card, Chip, AvatarGroup | ~2.5 j |
| Projects Overview | 8 spécifiques | ProgressBar, AvatarGroup | ~1.5 j |
| **Total brut** | **~50 composants** | — | **~10 j** dev front |

À ajouter : fixtures (~0.5 j), intégration server components + routing (~1 j), polish responsive et a11y (~1 j).

## Ordre d'implémentation suggéré

1. **Tokens & primitives** (Phase A) : palette `@theme`, typo, `Button`, `Chip`, `Card`, `Avatar`, `AvatarGroup`, `ProgressBar`, `IconButton`. → bloquant pour tout le reste.
2. **Navigation** (Phase B) : `Sidebar`, `BottomTabBar`, `MobileHeader`, `TopAppBar`. → permet de naviguer entre les 4 écrans en cours de construction.
3. **IdeaCard** (Phase C, transverse) : utilisé dans Dashboard (Trending) ET Idea Wall. À faire en premier après les primitives.
4. **Dashboard** (Phase D) : compose `SparkAChangeHero`, `InnovationJourneyCard`, `StatBlock`, `TrendingIdeasSection`, `AchievementsList`, `CommunityPulseFeed`.
5. **Idea Wall** (Phase E) : `CategoryFilterBar` + grid de `IdeaCard`.
6. **Idea Detail** (Phase F) : `LifecycleStepper`, `TeamDiscussion`, `ExecutionContextPanel`. C'est le plus dense.
7. **Projects Overview** (Phase G) : `ProjectCard`, `InnovationCycleHero`, `SprintWidgetMobile`.

## Choix techniques transverses

- **Tailwind v4 `@theme`** : tous les tokens couleur/typo/spacing du DESIGN.md y sont déclarés. Pas de `tailwind.config.ts`.
- **Server Components par défaut** : les écrans sont des RSC qui lisent les fixtures. Les composants interactifs (UpvoteButton, FAB, CategoryFilterBar avec état) sont des Client Components clairement annotés `'use client'`.
- **Icônes** : Material Symbols Outlined via `next/font/google` (le DESIGN.md et les HTML mockup l'utilisent), avec axes `FILL` pour les états actifs. Fallback à Lucide si Material Symbols pose problème (taille bundle).
- **i18n** : tous les libellés passent par `next-intl`. Les keys gamification (Visionary, Innovator) sont dans `messages/fr.json` et `messages/en.json`.
- **A11y** : tous les composants interactifs ont des `aria-label` ; le stepper a `role="progressbar"` avec `aria-valuenow`. Contraste vérifié contre la palette dans le DESIGN.md (déjà conforme WCAG AA selon la spec).

## Hors périmètre MVP

Ces composants seront nécessaires plus tard mais **ne sont pas dans le MVP lecture** :
- `CreateIdeaModal` / `CreateIdeaForm`
- `UpvoteButton` en version interactive (le bouton existe en lecture, l'action arrive plus tard)
- `CommentComposer`
- `NotificationsPanel`
- `AchievementUnlockedToast`
- `LevelUpAnimation` (framer-motion)
- `Profile` screen + onglet
