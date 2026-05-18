# IdeaStream — Notes de conception mobile

Source : `stitch_feature_quest/{tableau_de_bord_accueil, mur_d_id_es, d_tail_de_l_id_e, aper_u_des_projets}/` (variantes sans suffixe `_desktop`).

## Principes mobile transverses

- **Navigation primaire** : bottom tab bar fixe, 4 onglets (Home, Ideas, Projects, Profile). L'onglet actif est dans une pill arrondie violette (`secondary-container`). La sidebar desktop disparaît complètement.
- **Header** : compact (avatar utilisateur + logo "IdeaStream" + cloche notifications). Pas de search dans le header — la search vit à l'intérieur des écrans qui en ont besoin (Idea Wall).
- **FAB** : présent sur l'Idea Wall en bas à droite (couleur secondary, icône `+`) pour créer une idée. Pas de FAB sur les autres écrans.
- **Touch targets** : 48px minimum (alignés sur la spec du DESIGN.md).
- **Marges** : `margin-mobile = 16px` (vs `margin-desktop = 48px`).
- **Empilement** : tout le contenu desktop multi-colonnes devient une pile verticale. Les grids 3-cols (Trending Ideas, project cards) deviennent un carrousel horizontal `snap-x` ou une liste.

## Écran par écran — différences mobile vs desktop

### 1. Dashboard ("Spark a Change")

| Section | Desktop | Mobile |
|---|---|---|
| Header | Sidebar gauche + top bar avec search | Avatar + logo + cloche + chip XP (`2,450 Points`) |
| Hero "Spark a Change" | Card large avec visuel sparkles à droite | Card pleine largeur, CTA `New Idea` centré, pas de visuel |
| Innovation Journey | Card 2 colonnes (Level + Stats : 12 Days, 48 Total, 9 Earned) | Card empilée : Level + Visionary, XP bar, "7 Day Streak" + "12 Badges" inline |
| "Ideas Contributed" | Implicite (dans stats) | Card dédiée : `24` + sous-texte "3 ideas approved last month" |
| Trending Ideas | Grid 3 colonnes | Carrousel horizontal snap, cards 90% viewport width |
| Recent Achievements | Colonne dédiée à droite | Section après Trending, cards empilées |
| Community Pulse | Section bas pleine largeur avec icônes | Section bas, liste empilée |

**Décisions design induites** :
- L'XP chip dans le header mobile est un point d'entrée vers le profil/achievements — à prévoir comme component cliquable.
- Le carrousel Trending Ideas a besoin d'un indicateur de défilement (dots ou peek de la carte suivante).

### 2. Idea Wall

| Section | Desktop | Mobile |
|---|---|---|
| Header | Logo + search globale top bar | Logo + cloche seulement |
| Page header | Titre "Idea Wall" + filtres en haut | Pas de titre — direct search bar + filtres |
| Search | Top bar globale | Search bar dédiée pleine largeur sous le header |
| Filtres catégories | Pills horizontales à côté du titre | Pills horizontales scrollables, "All Ideas" actif |
| Cartes idées | Grid 3 colonnes | Liste verticale, 1 carte par ligne |
| Bouton "Load More" | Bouton centré en bas | Implicite (infinite scroll) |
| FAB | Absent | Présent en bas à droite (secondary) |
| Streak widget | Floating card bottom-right | Absent (l'info est sur le dashboard) |

**Décisions design induites** :
- Les cartes mobile ont la barre verticale gauche colorée (teal/purple selon catégorie ou statut — à arbitrer : la couleur encode-t-elle la catégorie ou le statut ?).
- Le upvote button mobile remplit l'icône (`thumb_up` filled) quand l'utilisateur a voté — état persistant à gérer côté DB.
- Le menu kebab (`⋮`) sur chaque carte mobile → quelles actions ? (signaler, partager, suivre).

### 3. Idea Detail

| Section | Desktop | Mobile |
|---|---|---|
| Header | Breadcrumbs (Dashboard › Idea Wall) + tabs section | Back arrow + logo + cloche + avatar |
| Lifecycle stepper | Stepper horizontal 4 étapes en haut du hero | Card dédiée "Current Stage" en haut, stepper 4 cercles |
| Title + description | Hero gauche large, badge upvote à droite | Card avec chips catégorie en haut, upvote count badge en haut à droite, titre 3 lignes, description |
| Design Artifacts | Section gauche avec liste de fichiers | Section dédiée plus bas |
| Team Discussion | Colonne gauche, replies nested | Section empilée |
| Execution Context | Colonne droite (Project, Sprint, Delivery, Complexity) | Grid 3 cards (Linked Project, Sprint Cycle, Est. Delivery) ; complexity séparé |
| Activity History | Colonne droite | Section dédiée plus bas |

**Décisions design induites** :
- Le stepper mobile a 4 cercles connectés avec icônes (check teal, person purple, code grey, double-check grey). L'étape active a la couleur secondary, les étapes complétées tertiary, les étapes à venir outline-variant. Component candidat : `LifecycleStepper` avec props `stages: Stage[]`, `currentIndex: number`.
- Les "3 cards meta" mobile (Project / Sprint / Delivery) sont une grille 1 col en très petit, 3 cols dès `sm:`. Préférer flex-wrap pour éviter du media-query.

### 4. Projects Overview

| Section | Desktop | Mobile |
|---|---|---|
| Header | Sidebar + top bar | Avatar + logo + cloche |
| Page header | Titre "Projects" + tabs (Active / Archived) + search | Titre "Projects & Sprints" + sous-titre count |
| Innovation Cycle hero | Card large 78% velocity + CTA "Initiate Sprint" à côté | Absent du mobile (priorité au listing) |
| Active Projects | Grid 3 cols | Liste 1 col |
| Project cards | Header chip + titre + description + progress + avatars + lien arrow | Identique structure mais full-width |
| Growth Insight / Streak | Section bento bas de page | Absente (sur dashboard mobile) |
| Sprint sidebar widget | Absent | Sticky bottom widget : Active Sprint + idea chips + tasks + CTA |
| CTA "New Stream" | Bouton dans hero | Bouton à côté du titre |

**Décisions design induites** :
- Le "Sprint widget" mobile est une nouveauté qui n'existe pas sur desktop — c'est une vue raccourcie pour l'utilisateur tech. À traiter comme un composant séparé optionnel.
- Sur mobile, le `chevron-right` à droite de chaque card est le tap target principal pour ouvrir le détail projet.

## Implications techniques

- **Breakpoint design** : Tailwind `md` (768px) suffit comme switch principal entre nav bottom-bar et sidebar. La grid de cards passe `grid-cols-1` → `md:grid-cols-2` → `lg:grid-cols-3`.
- **Composants à dual-renderer** : `Navigation` (Sidebar vs BottomTabBar), `Header` (TopAppBar vs MobileHeader). Plutôt qu'un seul composant responsive complexe, on aura deux composants côte à côte qui partagent les mêmes items via une source unique (`navigation.ts`).
- **Carrousels** : utiliser `overflow-x-auto snap-x snap-mandatory` natif CSS, pas besoin d'embla ou swiper pour le MVP lecture.
- **Bottom tab safe area** : prévoir `pb-[env(safe-area-inset-bottom)]` pour iOS notch.

## Risques / questions ouvertes

1. **Couleur barre verticale gauche des cartes idée** : catégorie ou statut ? Les maquettes mobile semblent montrer teal/purple côte à côte sans logique évidente. À trancher avant de typer `IdeaCardProps`.
2. **XP chip header mobile** : cliquable ? Vers où ? (Profile probablement.)
3. **Profile tab mobile** : pas de maquette fournie. À spécifier ou stub temporaire.
4. **Notifications cloche** : panneau dropdown ou écran dédié ? À trancher pour le MVP.
5. **Recherche globale** : le champ search desktop top bar a-t-il un équivalent mobile ? La maquette mobile ne le montre qu'au sein de l'Idea Wall.
