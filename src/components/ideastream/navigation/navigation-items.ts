// IdeaStream — source unique des items de navigation
// Consommée par Sidebar (desktop) et BottomTabBar (mobile).
//
// Convention :
// - sidebarItems : items principaux de la sidebar desktop
// - sidebarFooterItems : Settings / Support en bas de sidebar
// - bottomTabItems : 4 onglets mobile (Home / Ideas / Projects / Profile)
//
// Les routes IdeaStream (/idea-wall, /projects, /team, /profile) ne
// sont pas encore implémentées — les hrefs pointent vers ces paths
// futurs. Pendant la transition, certains items peuvent rester sur
// '#' (placeholders) ou les routes existantes.

import {
  Home,
  Lightbulb,
  Workflow,
  Users,
  Settings,
  LifeBuoy,
  User,
  type LucideIcon,
} from 'lucide-react';

export interface NavItemDefinition {
  /** Slug stable, utilisé comme key React et pour les tests. */
  id: string;
  /** Clé i18n du libellé. La traduction vit dans messages/<locale>.json. */
  labelKey: string;
  /** Libellé en clair pour le fallback (FR par défaut). */
  label: string;
  /** Route cible (Next.js App Router). */
  href: string;
  /** Icône Lucide affichée à gauche (sidebar) ou au-dessus (bottom tab). */
  icon: LucideIcon;
}

/**
 * Sidebar desktop — items principaux.
 * Ordre : Dashboard → Idea Wall → Projects → Team.
 */
export const sidebarItems: NavItemDefinition[] = [
  {
    id: 'dashboard',
    labelKey: 'nav.dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    id: 'idea-wall',
    labelKey: 'nav.ideaWall',
    label: 'Idea Wall',
    href: '/idea-wall',
    icon: Lightbulb,
  },
  {
    id: 'projects',
    labelKey: 'nav.projects',
    label: 'Projects',
    href: '/projects',
    icon: Workflow,
  },
  {
    id: 'team',
    labelKey: 'nav.team',
    label: 'Team',
    href: '/team',
    icon: Users,
  },
];

/**
 * Sidebar desktop — footer (Settings, Support).
 * Séparé pour pouvoir l'aligner en bas via flex.
 */
export const sidebarFooterItems: NavItemDefinition[] = [
  {
    id: 'settings',
    labelKey: 'nav.settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    id: 'support',
    labelKey: 'nav.support',
    label: 'Support',
    href: '/support',
    icon: LifeBuoy,
  },
];

/**
 * Bottom tab bar mobile — 4 onglets.
 * Le 4e onglet est Profile (utilisateur) et non Team (la liste).
 */
export const bottomTabItems: NavItemDefinition[] = [
  {
    id: 'dashboard',
    labelKey: 'nav.home',
    label: 'Home',
    href: '/dashboard',
    icon: Home,
  },
  {
    id: 'idea-wall',
    labelKey: 'nav.ideas',
    label: 'Ideas',
    href: '/idea-wall',
    icon: Lightbulb,
  },
  {
    id: 'projects',
    labelKey: 'nav.projects',
    label: 'Projects',
    href: '/projects',
    icon: Workflow,
  },
  {
    id: 'profile',
    labelKey: 'nav.profile',
    label: 'Profile',
    href: '/profile',
    icon: User,
  },
];

/**
 * Helper : détermine si un item est actif selon le pathname courant.
 * Match exact ou préfixe (`/dashboard/project/[id]` matche `/dashboard`).
 */
export function isNavItemActive(
  item: NavItemDefinition,
  pathname: string,
): boolean {
  if (item.href === '/') return pathname === '/';
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
