// FAB — Floating Action Button.
//
// Bouton flottant rond, fixe en bas a droite sur mobile. Utilise sur
// l'Idea Wall ("+" pour nouvelle idee). Couleur secondary, shadow
// secondary-glow.
//
// Note : sur mobile, position 'bottom-20' (au-dessus de la BottomTabBar
// haute de ~80px).

'use client';

import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

export interface FABProps {
  icon: LucideIcon;
  ariaLabel: string;
  onClick?: () => void;
  /** Affiche un libelle a cote de l'icone. */
  label?: string;
  className?: string;
}

export function FAB({ icon: Icon, ariaLabel, onClick, label, className }: FABProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={clsx(
        'fixed right-4 z-30 md:hidden',
        // Position : au-dessus de la BottomTabBar (~80px)
        'bottom-20 pb-safe-bottom',
        'flex items-center gap-2',
        label ? 'px-5 h-14 rounded-full' : 'w-14 h-14 rounded-full',
        'bg-secondary text-on-secondary',
        'shadow-secondary-glow hover:shadow-soft-lg',
        'transition-shadow active:translate-y-px',
        className,
      )}
    >
      <Icon className="w-6 h-6" strokeWidth={2.4} aria-hidden="true" />
      {label ? <span className="text-label-lg font-semibold">{label}</span> : null}
    </button>
  );
}
