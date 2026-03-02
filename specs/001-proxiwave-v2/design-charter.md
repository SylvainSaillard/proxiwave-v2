# Proxiwave v2 — Charte Graphique

> Ce document décrit la charte graphique complète de Proxiwave v2.
> Il fait référence pour toute création ou modification de composant UI.

---

## 1. Palette de couleurs

### Couleur principale — `pw-*` (bleu Proxiwave)

| Token       | Hex       | Usage                                      |
|-------------|-----------|---------------------------------------------|
| `pw-50`     | `#E8F4FD` | Fonds très légers, track ProgressRing       |
| `pw-100`    | `#BEE0F7` | Badges clairs, bordures actives légères     |
| `pw-200`    | `#90CAF0` | Bordures interactives focus                 |
| `pw-300`    | `#64B5F6` | Ring focus (`focus:ring-pw-300`)             |
| `pw-400`    | `#3AA0E8` | Avatars, accents secondaires                |
| `pw-500`    | `#1976D2` | **Couleur principale** — boutons, barres de progression, sidebar active, ProgressRing |
| `pw-600`    | `#1565A0` | Hover boutons principaux, texte accentué    |
| `pw-700`    | `#0D5A8E` | Texte fort sur fond clair, logo texte       |
| `pw-800`    | `#0B4F7A` | Réservé (peu utilisé)                       |
| `pw-900`    | `#083D5E` | Réservé (peu utilisé)                       |

### Fond & Surfaces — `cream`, `warm-*`

| Token       | Hex       | Usage                                      |
|-------------|-----------|---------------------------------------------|
| `cream`     | `#F8FAFB` | **Fond global** de l'application            |
| `warm-50`   | `#FAFAF8` | Fonds de cartes info, zones secondaires     |
| `warm-100`  | `#F4F3EF` | Bordures de cartes, séparateurs, hover léger |
| `warm-200`  | `#ECEAE4` | Bordures d'inputs, séparateurs principaux   |
| `warm-300`  | `#DDD9D0` | Scrollbar thumb, bordures appuyées          |
| `warm-400`  | `#C4BEB2` | Texte désactivé très léger                  |

### Couleurs Sky

| Token       | Hex       | Usage                                      |
|-------------|-----------|---------------------------------------------|
| `sky-50`    | `#F0F7FC` | Fonds KPI, stat blocks légers               |
| `sky-100`   | `#DBEDF8` | Badges "en revue"                           |
| `sky-200`   | `#B8DBF2` | Bordures accents sky                        |
| `sky-300`   | `#8FC6E9` | —                                           |
| `sky-400`   | `#5BAADB` | —                                           |

### Couleurs sémantiques (Tailwind defaults)

| Couleur     | Usage                                       |
|-------------|----------------------------------------------|
| `green-*`   | Succès, accepté, livré, basse priorité       |
| `amber-*`   | Attention, en revue, nouvelle, priorité moyenne |
| `red-*`     | Erreur, refusé, priorité haute               |
| `gray-900`  | **Texte principal**, sidebar background       |
| `gray-700`  | Texte secondaire                              |
| `gray-500`  | Texte tertiaire, icônes par défaut            |
| `gray-400`  | Texte léger, placeholders, labels secondaires |

---

## 2. Typographie

- **Police** : `Inter` (fallback `system-ui, sans-serif`)
- **Pas de dark mode** — le design est exclusivement light

### Hiérarchie

| Élément               | Classes Tailwind                                          |
|-----------------------|-----------------------------------------------------------|
| Titre page (h1)      | `text-2xl font-extrabold text-gray-900 tracking-tight`   |
| Titre section (h2)   | `text-lg font-bold text-gray-900`                         |
| Titre carte (h3)     | `text-base font-bold text-gray-900`                       |
| Sous-titre            | `text-sm font-semibold text-gray-900`                     |
| Texte courant         | `text-sm text-gray-600` ou `text-gray-500`                |
| Caption / Méta        | `text-[11px] text-gray-400` ou `text-xs text-gray-400`    |
| Micro-label (badge)   | `text-[10px] font-bold uppercase tracking-wider`           |
| KPI chiffre           | `text-2xl font-extrabold` ou `text-3xl font-extrabold`    |
| KPI label             | `text-[10px] font-bold uppercase tracking-wider`           |
| Landing hero titre    | `text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.12] tracking-tight` |
| Landing stat chiffre  | `text-4xl sm:text-5xl font-extrabold tracking-tight`      |

---

## 3. Espacement & Layout

### Valeurs clés

- **Gap standard entre cartes/sections** : `gap-4` ou `gap-5`
- **Padding interne cartes** : `p-4` à `p-6`
- **Padding page** : `px-6 pb-8` (dashboard)
- **Max width landing** : `max-w-7xl`

### Layout Bento Grid

L'interface utilise un **layout bento** avec des cartes aux coins très arrondis :

```
--radius-bento: 20px;  → classe `rounded-bento`
```

- Les cartes standard utilisent `rounded-xl` (12px) ou `rounded-2xl` (16px)
- Les blocs principaux et conteneurs utilisent `rounded-bento` (20px)
- Les badges utilisent `rounded-full`
- Les inputs utilisent `rounded-xl`
- Les boutons utilisent `rounded-xl` (dashboard) ou `rounded-full` (landing/CTA)

---

## 4. Composants UI

### Cartes

```
Carte standard :
  rounded-xl border border-warm-100 bg-white p-4
  hover:border-pw-200 hover:shadow-md hover:shadow-pw-500/5 transition-all

Carte info (KPI, stat) :
  rounded-xl bg-warm-50 p-3

Carte KPI colorée :
  rounded-xl bg-gradient-to-br from-{color}-50 to-{color}-100 border border-{color}-200 p-3 text-center

Carte bento principale :
  rounded-bento bg-warm-50 p-5
```

### Inputs

```
Input standard :
  w-full rounded-xl border border-warm-200 px-3 py-2.5 text-sm text-gray-900
  placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all

Select :
  même style que input

Textarea :
  même style + resize-none
```

### Boutons

```
Bouton principal (CTA) :
  rounded-xl bg-pw-500 px-5 py-2.5 text-sm font-semibold text-white
  hover:bg-pw-600 transition-all disabled:opacity-60

Bouton secondaire :
  rounded-xl border border-warm-200 px-4 py-2.5 text-sm font-medium text-gray-600
  hover:bg-warm-50 transition-all

Bouton landing CTA :
  rounded-full px-8 py-4 bg-gray-900 text-white font-semibold
  hover:bg-pw-600 transition-colors

Bouton icône (toolbar) :
  h-8 w-8 (ou h-10 w-10) rounded-xl bg-warm-50 flex items-center justify-center
  text-gray-400 hover:text-gray-600 hover:bg-warm-100 transition-colors

Bouton icône accent (action positive) :
  h-7 w-7 rounded-lg bg-white/70 border border-warm-200
  flex items-center justify-center text-gray-400
  hover:text-pw-600 hover:border-pw-300 transition-all
```

### Badges / Status

```
Badge standard :
  inline-flex items-center rounded-full px-2.5 py-0.5
  text-[10px] font-bold uppercase tracking-wider
  bg-{color}-100 text-{color}-700

Badge petite taille :
  rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border
```

### Barres de progression

```
ProgressBar :
  Container : w-full rounded-full overflow-hidden h-2 bg-white/80
  Barre : h-full rounded-full bg-pw-500 transition-all duration-700

ProgressRing :
  Track : stroke #E8F4FD (pw-50)
  Barre : stroke #1976D2 (pw-500), strokeLinecap round
  Centre : text-3xl font-extrabold text-gray-900 + label text-[10px]
```

### Avatars

```
Avatar utilisateur :
  h-9 w-9 (ou h-10 w-10) rounded-full (ou rounded-xl)
  flex items-center justify-center
  text-[10px] font-bold text-white
  background: couleur dynamique (avatar_color)
  Contenu : initiales (2 lettres)
```

---

## 5. Icônes

### Bibliothèque : Lucide React uniquement

**Aucun emoji** dans l'interface. Toutes les icônes sont des composants Lucide React.

### Tailles standard

| Contexte             | Taille             |
|----------------------|--------------------|
| Navigation sidebar   | `h-5 w-5`         |
| Icône dans bouton    | `h-4 w-4`         |
| Icône dans carte KPI | `h-4 w-4` dans un conteneur rond `h-8 w-8 rounded-full bg-{color}-50` |
| Icône label KPI      | `h-3 w-3` (inline avec le texte) |
| Icône badge/chip     | `h-3 w-3` ou `h-2.5 w-2.5` |
| Icône hero landing   | `h-3.5 w-3.5`     |
| Icône état idée      | `h-5 w-5` dans un conteneur `h-9 w-9 rounded-lg bg-white/70` |

### Mapping icônes par contexte

**Statuts idées :**
- Nouvelle → `Sparkles` (amber)
- En revue → `Search` (sky)
- Acceptée → `CheckCircle2` (green)
- Refusée/Notée → `XCircle` (gray)

**Priorités tâches :**
- Haute → `ArrowUpCircle` (red)
- Moyenne → `MinusCircle` (amber)
- Basse → `MinusCircle` (green)

**Onglets dashboard :**
- Idées → `Lightbulb` (amber)
- Messages → `MessageSquare`
- Tâches → `Zap` (pw)
- Sprints → `Flag`
- Documents → `FileText`

**Catégories documents :**
- Livrable → `Package`
- Spécification → `ClipboardList`
- Design → `Palette`
- Rapport → `BarChart3`
- Facture → `Receipt`

**Navigation sidebar :**
- Accueil → `Home`
- Projets → `FolderKanban`
- Documents → `FileText`
- Messages → `MessageSquare`
- Paramètres → `Settings`

**Actions :**
- Fermer → `X`
- Modifier → `Pencil`
- Télécharger → `Download`
- Rechercher → `Search`
- Filtrer → `Filter`
- Retour → `ArrowLeft`
- Favori → `Star` (fill conditionnel)

**Satisfaction :**
- Score → `Star` avec couleur conditionnelle (green/pw/amber/gray selon score)

---

## 6. Ombres

| Usage                    | Classes                                    |
|--------------------------|--------------------------------------------|
| Carte hover              | `shadow-md shadow-pw-500/5`                |
| Sidebar item actif       | `shadow-lg shadow-pw-500/30`               |
| Panneau détail           | `shadow-lg shadow-pw-500/5`                |
| Idée acceptée (glow)     | `shadow-sm shadow-green-200`               |
| Landing badges sur image | `shadow-lg`                                |

---

## 7. Animations

- **Framework** : Framer Motion 11
- **Respecter** `prefers-reduced-motion`
- **Transitions standard** : `transition-all` ou `transition-colors` (durée Tailwind par défaut)
- **Hover scale** : `hover:scale-[1.005]` (cartes), `hover:scale-[1.02]` (CTA landing)
- **Active scale** : `active:scale-[0.98]` (boutons landing)
- **Progress bars** : `transition-all duration-700`
- **Fade-in page** : keyframe `fadeIn 0.6s ease-out forwards`
- **Landing sections** : Framer Motion `AnimatedSection` avec stagger

---

## 8. Sidebar

```
Container :
  hidden md:flex flex-col items-center gap-2
  bg-gray-900 py-6 px-3 rounded-bento w-[72px] shrink-0

Item navigation :
  h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-200
  Actif : bg-pw-500 text-white shadow-lg shadow-pw-500/30
  Inactif : text-gray-400 hover:text-white hover:bg-white/10
```

---

## 9. TopBar

```
Container :
  flex items-center justify-between gap-4 px-6 py-4

Nom app :
  text-xl font-bold text-gray-900 tracking-tight

Barre de recherche :
  rounded-xl border border-warm-200 bg-white pl-10 pr-4 py-2.5

Bouton notification :
  h-10 w-10 rounded-xl bg-white border border-warm-200

Avatar :
  h-10 w-10 rounded-xl + nom en text-sm font-semibold + rôle en text-xs text-gray-400
```

---

## 10. Landing Page

### Header

```
Fond scrollé : bg-cream/90 backdrop-blur-xl shadow-sm
Nav items : rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-pw-50 hover:text-pw-700
Login : rounded-full px-5 py-2.5 text-xs font-semibold border border-gray-200
CTA : rounded-full px-5 py-2.5 text-xs font-semibold bg-gray-900 text-white hover:bg-pw-600
```

### Hero Bento Grid

```
Blocs images : rounded-bento overflow-hidden + gradient overlay + badge flottant
Bloc titre : rounded-bento bg-pw-50 p-8 sm:p-10
Bloc stat clair : rounded-bento bg-sky-50 p-6, chiffre text-4xl font-extrabold text-pw-600
Bloc stat accent : rounded-bento bg-pw-500 p-6, chiffre text-4xl font-extrabold text-white
Badges sur images : rounded-full bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-semibold shadow-lg
```

---

## 11. Règles strictes

1. **Aucun emoji** — Utiliser exclusivement des icônes Lucide React
2. **Aucun dark mode** — Design exclusivement light sur fond `cream`
3. **Pas de couleurs hors palette** — Se limiter aux tokens `pw-*`, `warm-*`, `sky-*`, `cream` et aux sémantiques Tailwind (`green-*`, `amber-*`, `red-*`, `gray-*`)
4. **Coins arrondis** — Toujours `rounded-xl` minimum, `rounded-bento` pour les conteneurs, `rounded-full` pour badges/CTA landing
5. **Typographie** — `font-extrabold` pour titres et KPI, `font-bold` pour sous-titres, `font-semibold` pour labels
6. **Ombres douces** — Uniquement les ombres avec opacity faible (`shadow-pw-500/5`, `shadow-pw-500/30`)
7. **Espacement généreux** — Préférer `gap-4`/`gap-5`, `p-4`/`p-5`/`p-6`
8. **Icônes dans conteneurs** — Les icônes KPI sont toujours dans un conteneur rond coloré (`h-8 w-8 rounded-full bg-{color}-50`)
9. **Labels KPI** — Format `text-[10px] font-bold uppercase tracking-wider` avec icône inline `h-3 w-3`
10. **Transitions** — Toujours ajouter `transition-all` ou `transition-colors` sur les éléments interactifs
