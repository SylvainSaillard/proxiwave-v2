// StatBlock — card simple "Big number" + label + sous-texte.
//
// Utilisée pour "12 Days" (streak), "48 Total" (badges), "9 Earned",
// "24 Ideas Contributed". Variant icône optionnel.

import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

export interface StatBlockProps {
  value: string | number;
  label: string;
  subtext?: string;
  icon?: LucideIcon;
  /** Couleur de l'icône (variants design system). */
  iconColor?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
}

const iconColorClass = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
};

export function StatBlock({
  value,
  label,
  subtext,
  icon: Icon,
  iconColor = 'primary',
  className,
}: StatBlockProps) {
  return (
    <div
      className={clsx(
        'bg-surface-container-lowest rounded-lg p-4 md:p-5',
        'border border-outline-variant/40 shadow-soft',
        'flex flex-col items-center text-center gap-1',
        className,
      )}
    >
      {Icon ? (
        <Icon
          className={clsx('w-6 h-6 mb-1', iconColorClass[iconColor])}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      ) : null}
      <span className="font-display font-bold text-headline-lg text-primary tabular-nums">
        {value}
      </span>
      <span className="text-label-md text-on-surface-variant">{label}</span>
      {subtext ? (
        <span className="text-label-sm text-on-surface-variant/80 italic mt-1">
          “{subtext}”
        </span>
      ) : null}
    </div>
  );
}
