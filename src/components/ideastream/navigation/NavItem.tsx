'use client';

// NavItem — item de navigation générique.
// Deux variants visuels :
//   - 'sidebar' : ligne horizontale (icône + label à droite), grande
//     zone de tap, état actif avec fond primary-fixed et texte
//     on-primary-fixed-variant.
//   - 'bottom-tab' : colonne (icône au-dessus, label en dessous), état
//     actif avec icône dans une pill secondary-container.

import Link from 'next/link';
import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

export type NavItemVariant = 'sidebar' | 'bottom-tab';

export interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  variant?: NavItemVariant;
}

export function NavItem({
  href,
  label,
  icon: Icon,
  isActive,
  variant = 'sidebar',
}: NavItemProps) {
  if (variant === 'bottom-tab') {
    return (
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        className={clsx(
          'flex flex-col items-center justify-center gap-1 px-3 py-2',
          'min-w-[64px] min-h-[48px] rounded-full transition-colors',
          'text-on-surface-variant hover:text-on-surface',
          isActive && 'text-on-secondary-container',
        )}
      >
        <span
          className={clsx(
            'flex items-center justify-center px-4 py-1 rounded-full transition-colors',
            isActive
              ? 'bg-secondary-container text-on-secondary-container'
              : 'bg-transparent',
          )}
        >
          <Icon
            className="w-5 h-5"
            strokeWidth={isActive ? 2.4 : 1.8}
            aria-hidden="true"
          />
        </span>
        <span
          className={clsx(
            'text-label-sm font-medium',
            isActive ? 'text-on-surface' : 'text-on-surface-variant',
          )}
        >
          {label}
        </span>
      </Link>
    );
  }

  // sidebar variant
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'flex items-center gap-3 px-4 py-2.5 rounded-full transition-colors',
        'text-body-sm font-medium',
        isActive
          ? 'bg-primary-fixed text-on-primary-fixed-variant'
          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
      )}
    >
      <Icon
        className="w-5 h-5 shrink-0"
        strokeWidth={isActive ? 2.2 : 1.8}
        aria-hidden="true"
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}
