// ContributionStreakWidget — petite card flame + jours.
//
// Utilisée en :
//   - Dashboard mobile (section gamification)
//   - Idea Wall desktop (floating bottom-right)
//   - Projects bento (Growth Insight neighbor)

import { Flame } from 'lucide-react';
import { clsx } from 'clsx';

export interface ContributionStreakWidgetProps {
  /** Nombre de jours consécutifs (ex: 12). */
  days: number;
  /** Label sous le nombre ("Contribution Streak"). */
  label?: string;
  /** Variant : compact (floating widget) ou full (card dashboard). */
  variant?: 'compact' | 'full';
  className?: string;
}

export function ContributionStreakWidget({
  days,
  label = 'Contribution Streak',
  variant = 'full',
  className,
}: ContributionStreakWidgetProps) {
  if (variant === 'compact') {
    return (
      <div
        className={clsx(
          'inline-flex items-center gap-2',
          'px-4 py-3 rounded-full',
          'bg-secondary-fixed text-on-secondary-fixed-variant',
          'shadow-secondary-glow',
          className,
        )}
        aria-label={`${label}: ${days} days`}
      >
        <Flame className="w-5 h-5 text-secondary" strokeWidth={2.2} fill="currentColor" aria-hidden="true" />
        <div className="flex flex-col leading-tight">
          <span className="text-label-sm font-semibold uppercase tracking-wider">
            {label}
          </span>
          <span className="font-display font-bold text-body-lg tabular-nums">
            {days} Days
          </span>
        </div>
      </div>
    );
  }

  return (
    <section
      className={clsx(
        'bg-surface-container-lowest rounded-lg p-5',
        'border border-outline-variant/40 shadow-soft',
        'flex items-center gap-4',
        className,
      )}
    >
      <span className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
        <Flame className="w-6 h-6 text-secondary" strokeWidth={2.2} fill="currentColor" aria-hidden="true" />
      </span>
      <div className="flex flex-col min-w-0">
        <span className="font-display font-bold text-headline-md text-on-surface tabular-nums">
          {days} <span className="text-body-md font-normal text-on-surface-variant">Days</span>
        </span>
        <span className="text-label-md text-on-surface-variant">{label}</span>
      </div>
    </section>
  );
}
