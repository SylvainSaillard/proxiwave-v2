// TrendingIdeasSection — section "Trending Ideas" du Dashboard.
//
// Sur desktop : grid 3 colonnes max.
// Sur mobile : carrousel horizontal scroll-snap (overflow-x-auto).
//
// Header avec titre + sous-titre + lien "View All".

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { IdeaCard } from '@/components/ideastream/ideas/IdeaCard';
import type { Idea } from '@/types/ideastream';

export interface TrendingIdeasSectionProps {
  ideas: Idea[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  className?: string;
}

export function TrendingIdeasSection({
  ideas,
  title = 'Trending Ideas',
  subtitle = 'Concepts gaining momentum in the community',
  viewAllHref = '/ideastream/idea-wall',
  className,
}: TrendingIdeasSectionProps) {
  return (
    <section className={clsx('flex flex-col gap-4', className)}>
      <header className="flex items-end justify-between gap-4">
        <div className="flex flex-col">
          <h2 className="font-display font-bold text-headline-lg text-on-surface">
            {title}
          </h2>
          <p className="text-body-sm text-on-surface-variant">{subtitle}</p>
        </div>
        <Link
          href={viewAllHref}
          className="text-label-md text-primary font-semibold hover:underline inline-flex items-center gap-1 whitespace-nowrap"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </header>

      {/* Mobile : carrousel scroll-snap ; Desktop : grid 3 cols */}
      <div
        className={clsx(
          'flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory',
          '-mx-4 px-4 pb-2', // bleed edges
        )}
      >
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            variant="compact"
            href={`/ideastream/idea/${idea.id}`}
            className="snap-start shrink-0 w-[88%]"
          />
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            variant="compact"
            href={`/ideastream/idea/${idea.id}`}
          />
        ))}
      </div>
    </section>
  );
}
