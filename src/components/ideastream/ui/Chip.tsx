// Chip — pill arrondie avec fond tinté et texte contrasté.
//
// Spécialisations : StatusBadge (statut idée), CategoryChip (catégorie).
// Pour les besoins libres, Chip directement avec une couleur sémantique.

import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';
import type { IdeaSemanticColor } from '@/types/ideastream';

export interface ChipProps {
  label: string;
  color?: IdeaSemanticColor;
  icon?: LucideIcon;
  /** Variant : 'filled' (fond tinté) ou 'outline' (bordure seulement). */
  variant?: 'filled' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

// Mapping des couleurs sémantiques vers les tokens de design.
const filledColors: Record<IdeaSemanticColor, string> = {
  primary: 'bg-primary-fixed text-on-primary-fixed-variant',
  secondary: 'bg-secondary-fixed text-on-secondary-fixed-variant',
  tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  neutral: 'bg-surface-container text-on-surface-variant',
  error: 'bg-error-container text-on-error-container',
};

const outlineColors: Record<IdeaSemanticColor, string> = {
  primary: 'border border-primary/30 text-on-primary-fixed-variant',
  secondary: 'border border-secondary/30 text-on-secondary-fixed-variant',
  tertiary: 'border border-tertiary/30 text-on-tertiary-fixed-variant',
  neutral: 'border border-outline-variant text-on-surface-variant',
  error: 'border border-error/30 text-on-error-container',
};

const sizeClasses = {
  sm: 'text-label-sm px-2 py-0.5 gap-1',
  md: 'text-label-md px-3 py-1 gap-1.5',
};

export function Chip({
  label,
  color = 'neutral',
  icon: Icon,
  variant = 'filled',
  size = 'md',
  className,
}: ChipProps) {
  const colorClasses =
    variant === 'filled' ? filledColors[color] : outlineColors[color];

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-semibold whitespace-nowrap',
        colorClasses,
        sizeClasses[size],
        className,
      )}
    >
      {Icon ? <Icon className="w-3 h-3" aria-hidden="true" /> : null}
      <span>{label}</span>
    </span>
  );
}
