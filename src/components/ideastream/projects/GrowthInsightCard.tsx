// GrowthInsightCard — bento "Growth Insight" avec icone trendup.
//
// Texte court + lien "Keep up the momentum". Affiche un insight
// genere (ex: "Your team's completion rate is up 12% compared to
// the same week in Sprint 21").

import { TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';

export interface GrowthInsightCardProps {
  message: string;
  cta?: string;
  className?: string;
}

export function GrowthInsightCard({
  message,
  cta = 'Keep up the momentum',
  className,
}: GrowthInsightCardProps) {
  return (
    <section
      className={clsx(
        'bg-surface-container-lowest rounded-lg p-5',
        'border border-outline-variant/40 shadow-soft',
        'flex flex-col gap-3',
        className,
      )}
    >
      <header className="flex items-center gap-2">
        <span className="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center">
          <TrendingUp className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
        </span>
        <h3 className="font-display font-bold text-headline-md text-on-surface">
          Growth Insight
        </h3>
      </header>
      <p className="text-body-sm text-on-surface-variant">{message}</p>
      <span className="text-label-md text-tertiary font-semibold">{cta}</span>
    </section>
  );
}
