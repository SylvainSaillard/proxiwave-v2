// SparkAChangeHero — bandeau d'accueil "Spark a Change.".
//
// Card large à gradient (indigo → electric purple), titre display
// inspirant, sous-titre, CTA "New Idea" en pill blanc, visuel
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
        'relative overflow-hidden isolate',
        'bg-spark-gradient text-white',
        'rounded-xl p-6 md:p-10',
        'shadow-primary-glow',
        className,
      )}
    >
      {/* Décor sparkles, visible md+ */}
      <Sparkles
        className="hidden md:block absolute -right-6 -top-6 w-40 h-40 text-white/15 rotate-12 pointer-events-none"
        strokeWidth={1.2}
        aria-hidden="true"
      />
      <Sparkles
        className="hidden md:block absolute right-16 bottom-6 w-16 h-16 text-white/20 pointer-events-none"
        strokeWidth={1.6}
        aria-hidden="true"
      />

      {/* Container interne : block + max-w pour limiter la largeur de
          la colonne de texte, sans utiliser flex (eviter tout
          flex-shrink intempestif qui squeezerait le <p>). */}
      <div className="relative max-w-2xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
          {title}
        </h1>

        {/* Sous-titre : block explicit + classes Tailwind standard
            (text-base/text-lg) pour eviter tout probleme de tokens
            custom. w-full force l'occupation horizontale jusqu'au
            max-w-xl, evitant un wrap mot-par-mot involontaire. */}
        <p className="block w-full max-w-xl mt-4 md:mt-6 text-base md:text-lg leading-relaxed text-white/85">
          {subtitle}
        </p>

        <div className="mt-6 md:mt-8">
          <button
            type="button"
            className={clsx(
              'inline-flex items-center gap-2',
              'px-6 py-3 rounded-full',
              'bg-white text-[#3323cc]',
              'text-sm md:text-base font-semibold',
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
