// SparkAChangeHero — bandeau d'accueil "Spark a Change.".
//
// Card large à gradient (indigo → electric purple). Layout responsive :
//   - Mobile  : pile verticale (titre, sous-titre, CTA) + petit sparkle
//     d'angle décoratif.
//   - Desktop : 2 colonnes via grid 12 — contenu à gauche (7/12), zone
//     visuelle (halo + sparkles) à droite (5/12). Le sous-titre a une
//     "measure" de lecture confortable (~52ch) plutôt que de s'étaler.
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
        'rounded-xl shadow-primary-glow',
        // Grid : 1 col mobile, 12 cols desktop (contenu + visuel)
        'grid grid-cols-1 lg:grid-cols-12 items-center gap-6',
        'p-6 sm:p-8 lg:p-12',
        className,
      )}
    >
      {/* Colonne contenu — ~7/12 desktop */}
      <div className="lg:col-span-7 flex flex-col gap-5 lg:gap-6">
        <h1 className="font-display font-bold leading-[1.05] text-4xl sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {/* Sous-titre : measure de lecture confortable (~52ch) */}
        <p className="text-base sm:text-lg leading-relaxed text-white/85 max-w-[52ch]">
          {subtitle}
        </p>

        <div>
          <button
            type="button"
            className={clsx(
              'inline-flex items-center gap-2',
              'px-6 py-3 rounded-full',
              'bg-white text-[#3323cc]',
              'text-sm sm:text-base font-semibold',
              'shadow-soft-lg hover:shadow-primary-glow-lg',
              'transition-shadow active:translate-y-px',
            )}
          >
            <Plus className="w-5 h-5" strokeWidth={2.4} aria-hidden="true" />
            {ctaLabel}
          </button>
        </div>
      </div>

      {/* Colonne visuelle — desktop only, ~5/12 : halo radial + sparkles */}
      <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center min-h-[180px]">
        <div
          className="absolute inset-0 rounded-full bg-white/10 blur-3xl scale-90"
          aria-hidden="true"
        />
        <Sparkles
          className="relative w-44 h-44 xl:w-52 xl:h-52 text-white/25 rotate-12"
          strokeWidth={1}
          aria-hidden="true"
        />
        <Sparkles
          className="absolute right-2 bottom-2 w-16 h-16 text-white/30"
          strokeWidth={1.4}
          aria-hidden="true"
        />
        <Sparkles
          className="absolute left-4 top-6 w-10 h-10 text-white/20"
          strokeWidth={1.6}
          aria-hidden="true"
        />
      </div>

      {/* Décor mobile/tablette : sparkle d'angle, hors flux */}
      <Sparkles
        className="lg:hidden absolute -right-4 -top-4 w-24 h-24 text-white/15 rotate-12 pointer-events-none"
        strokeWidth={1.2}
        aria-hidden="true"
      />
    </section>
  );
}
