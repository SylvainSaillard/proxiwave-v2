---
description: Charte graphique Proxiwave v2 — règles visuelles obligatoires pour tout composant UI
---

# Charte Graphique Proxiwave v2

> Documentation complète : `specs/001-proxiwave-v2/design-charter.md`

---

## Palette

- **Principale** : `pw-500` (#1976D2) — boutons, barres, sidebar active
- **Fond global** : `cream` (#F8FAFB)
- **Surfaces** : `warm-50` à `warm-400` — fonds cartes, bordures, inputs
- **Accents** : `sky-*` pour éléments légers, `green-*` succès, `amber-*` attention, `red-*` erreur
- **Texte** : `gray-900` principal, `gray-500` secondaire, `gray-400` léger

## Icônes — CRITIQUE

- **Lucide React uniquement** — **AUCUN emoji** dans le code ou l'interface
- Tailles : `h-5 w-5` (nav), `h-4 w-4` (boutons/cartes), `h-3 w-3` (labels KPI inline)
- Icônes KPI : toujours dans un conteneur rond `h-8 w-8 rounded-full bg-{color}-50`
- Labels KPI : `text-[10px] font-bold uppercase tracking-wider` + icône `h-3 w-3` inline

## Typographie

- Police : `Inter` (system-ui fallback)
- Titres : `font-extrabold` | Sous-titres : `font-bold` | Labels : `font-semibold`
- KPI chiffres : `text-2xl font-extrabold` ou `text-3xl font-extrabold`
- Micro-labels : `text-[10px] font-bold uppercase tracking-wider`
- Aucun dark mode

## Coins arrondis

- Conteneurs principaux : `rounded-bento` (20px)
- Cartes / inputs / boutons dashboard : `rounded-xl` (12px)
- Badges : `rounded-full`
- Boutons CTA landing : `rounded-full`

## Composants clés

### Cartes
```
Standard : rounded-xl border border-warm-100 bg-white p-4 hover:border-pw-200 hover:shadow-md hover:shadow-pw-500/5
KPI colorée : rounded-xl bg-gradient-to-br from-{color}-50 to-{color}-100 border border-{color}-200 p-3 text-center
Info : rounded-xl bg-warm-50 p-3
```

### Inputs
```
rounded-xl border border-warm-200 px-3 py-2.5 text-sm text-gray-900
placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent
```

### Boutons
```
Principal : rounded-xl bg-pw-500 text-white font-semibold hover:bg-pw-600 disabled:opacity-60
Secondaire : rounded-xl border border-warm-200 text-gray-600 hover:bg-warm-50
Icône : h-8 w-8 rounded-xl bg-warm-50 text-gray-400 hover:text-gray-600 hover:bg-warm-100
```

### Badges
```
rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-{color}-100 text-{color}-700
```

## Ombres

- Carte hover : `shadow-md shadow-pw-500/5`
- Sidebar active : `shadow-lg shadow-pw-500/30`
- Panneau détail : `shadow-lg shadow-pw-500/5`

## Sidebar

```
bg-gray-900 rounded-bento w-[72px]
Item actif : bg-pw-500 text-white shadow-lg shadow-pw-500/30
Item inactif : text-gray-400 hover:text-white hover:bg-white/10
```

## Animations

- Framer Motion 11, respecter `prefers-reduced-motion`
- Hover cartes : `hover:scale-[1.005]`
- Progress bars : `transition-all duration-700`
- Éléments interactifs : toujours `transition-all` ou `transition-colors`

## Règles strictes

1. **Zéro emoji** — Lucide React exclusivement
2. **Zéro dark mode** — Light only sur fond `cream`
3. **Palette fermée** — `pw-*`, `warm-*`, `sky-*`, `cream` + sémantiques Tailwind
4. **Coins arrondis min `rounded-xl`** — jamais de coins droits
5. **Espacement généreux** — `gap-4`/`gap-5`, `p-4`/`p-5`/`p-6`
6. **Ombres douces** — opacity faible uniquement
7. **Transitions systématiques** sur éléments interactifs
