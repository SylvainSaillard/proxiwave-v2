// IdeaHero — section hero de l'ecran Idea Detail.
//
// Affichage :
//   - meta dot (GamificationEngine · Posted 2 days ago)
//   - chips (Trending, Collaboration) — pour les attributs marketing
//   - titre display
//   - sous-titre / description courte
//   - UpvoteButton en pill (desktop) ou stacked (mobile)

import { Chip } from '@/components/ideastream/ui/Chip';
import { UpvoteButton } from '@/components/ideastream/ideas/UpvoteButton';
import { CategoryChip } from '@/components/ideastream/ideas/CategoryChip';
import { StatusBadge, statusLabelMap } from '@/components/ideastream/ideas/StatusBadge';
import { RelativeTime } from '@/components/ideastream/ui/RelativeTime';
import type { Idea } from '@/types/ideastream';

export interface IdeaHeroProps {
  idea: Idea;
  className?: string;
}

export function IdeaHero({ idea, className }: IdeaHeroProps) {
  const inApprovalQueue = idea.status === 'approved';

  return (
    <header className={className}>
      {/* Breadcrumbs / meta (desktop) */}
      <div className="hidden md:flex items-center gap-2 text-label-md text-on-surface-variant mb-3">
        <span className="font-medium text-secondary">
          {idea.category.label}
        </span>
        <span aria-hidden="true">·</span>
        <span>
          Posted <RelativeTime date={idea.createdAt} />
        </span>
      </div>

      {/* Status pill mobile only */}
      <div className="md:hidden flex items-center gap-2 mb-3">
        <Chip label="Trending" color="tertiary" />
        <CategoryChip category={idea.category} />
      </div>

      {/* Titre + upvote (split desktop : titre gauche, upvote droite) */}
      <div className="flex items-start justify-between gap-6">
        <h1 className="font-display font-bold text-display-lg-mobile lg:text-display-lg text-on-surface leading-tight">
          {idea.title}
        </h1>

        {/* Upvote pill desktop / stacked mobile */}
        <div className="hidden md:block shrink-0">
          <UpvoteButton
            count={idea.upvotesCount}
            isActive={idea.hasUserVoted}
            variant="pill"
          />
        </div>
        <div className="md:hidden shrink-0">
          <UpvoteButton
            count={idea.upvotesCount}
            isActive={idea.hasUserVoted}
            variant="stacked"
          />
        </div>
      </div>

      {/* Status chip "In Approval Queue" (uniquement si approved) */}
      {inApprovalQueue ? (
        <div className="mt-4 hidden md:inline-flex">
          <Chip
            label={`In ${statusLabelMap[idea.status]} Queue`}
            color="secondary"
            size="md"
          />
        </div>
      ) : (
        <div className="mt-4 hidden md:inline-flex">
          <StatusBadge status={idea.status} size="md" />
        </div>
      )}

      {/* Description */}
      <p className="text-body-md md:text-body-lg text-on-surface-variant mt-4 max-w-3xl">
        {idea.description}
      </p>
    </header>
  );
}
