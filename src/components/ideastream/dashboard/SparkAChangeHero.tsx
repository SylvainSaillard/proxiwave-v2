// SparkAChangeHero — bandeau d'accueil "Spark a Change.".
//
// Card large à gradient (indigo → electric purple), titre display
// inspirant, sous-titre, CTA "New Idea" en pill secondary, visuel
// sparkles décoratif à droite (desktop).
//
// Server Component pur ; CTA visuel uniquement en MVP lecture.

import { Plus, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export interface SparkAChangeHeroProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  className?: string;
}

export function SparkAChangeHero({
  title = 'Spark a Change.',
  subtitle = 'Every great breakthrough starts with a single, messy thought. What’s on your mind today? Let’s turn that spark into a flame.',
  ctaLabel = 'New Idea',
  className,
}: SparkAChangeHeroProps) {
  return (
    <section
      className={clsx(
        'relative overflow-hidden',
        'bg-spark-gradient text-white',
        'rounded-xl p-6 md:p-10',
        'shadow-primary-glow',
        className,
      )}
    >
      {/* Décor sparkles, visible md+ */}
      <Sparkles
        className="hidden md:block absolute -right-6 -top-6 w-40 h-40 text-white/15 rotate-12"
        strokeWidth={1.2}
        aria-hidden="true"
      />
      <Sparkles
        className="hidden md:block absolute right-16 bottom-6 w-16 h-16 text-white/20"
        strokeWidth={1.6}
        aria-hidden="true"
      />

      <div className="relative max-w-2xl flex flex-col gap-4 md:gap-6">
        <h1 className="font-display text-display-lg-mobile md:text-display-lg leading-tight">
          {title}
        </h1>
        <p className="text-body-md md:text-body-lg text-white/85 max-w-xl">
          {subtitle}
        </p>

        <div>
          <button
            type="button"
            className={clsx(
              'inline-flex items-center gap-2',
              'px-6 py-3 rounded-full',
              'bg-white text-on-primary-fixed-variant',
              'text-label-lg font-semibold',
              'shadow-soft-lg hover:shadow-primary-glow-lg',
              'transition-shadow active:translate-y-px',
            )}
          >
            <Plus className="w-5 h-5" strokeWidth={2.4} aria-hidden="true" />
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
