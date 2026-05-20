// InitiateSprintCard — card dashed avec icone eclair + CTA.
//
// Promote la creation d'un sprint quand l'utilisateur est entre deux
// cycles. MVP : bouton visuel uniquement.

import { Zap } from 'lucide-react';
import { clsx } from 'clsx';

export interface InitiateSprintCardProps {
  className?: string;
}

export function InitiateSprintCard({ className }: InitiateSprintCardProps) {
  return (
    <section
      className={clsx(
        'flex flex-col items-center justify-center gap-3 text-center',
        'rounded-xl border-2 border-dashed border-secondary/40',
        'bg-secondary-fixed/40 p-6 md:p-8',
        className,
      )}
    >
      <span className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center">
        <Zap className="w-6 h-6 text-secondary" strokeWidth={2.2} fill="currentColor" aria-hidden="true" />
      </span>
      <h3 className="font-display font-semibold text-headline-md text-on-surface">
        Initiate Sprint
      </h3>
      <p className="text-body-sm text-on-surface-variant max-w-xs">
        Batch ideas and team momentum into a new active development cycle.
      </p>
      <button
        type="button"
        className={clsx(
          'inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-full',
          'bg-secondary text-on-secondary text-label-lg font-semibold',
          'shadow-secondary-glow hover:shadow-soft-lg transition-shadow',
        )}
      >
        Create New Sprint
      </button>
    </section>
  );
}
