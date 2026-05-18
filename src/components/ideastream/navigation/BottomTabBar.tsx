'use client';

// BottomTabBar IdeaStream (mobile) — < md
// Source maquette : stitch_feature_quest/*/code.html (sans suffixe _desktop)
//
// 4 onglets : Home / Ideas / Projects / Profile.
// Fixe en bas de l'écran, fond surface-container-lowest, ombre top,
// pb-safe pour respecter le notch iOS.
//
// L'item actif affiche son icône dans une pill secondary-container.
// Le label sous l'icône passe à text-on-surface (vs on-surface-variant).

import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { NavItem } from './NavItem';
import { bottomTabItems, isNavItemActive } from './navigation-items';

export interface BottomTabBarProps {
  className?: string;
}

export function BottomTabBar({ className }: BottomTabBarProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className={clsx(
        // Visible uniquement sur mobile
        'md:hidden',
        // Position : fixe en bas
        'fixed bottom-0 left-0 right-0 z-40',
        // Style : carte élevée
        'bg-surface-container-lowest border-t border-outline-variant',
        'shadow-soft-lg',
        // Layout 4 colonnes
        'flex items-center justify-around',
        'px-2 pt-2 pb-safe',
        className,
      )}
    >
      {bottomTabItems.map((item) => (
        <NavItem
          key={item.id}
          href={item.href}
          label={item.label}
          icon={item.icon}
          isActive={isNavItemActive(item, pathname)}
          variant="bottom-tab"
        />
      ))}
    </nav>
  );
}
