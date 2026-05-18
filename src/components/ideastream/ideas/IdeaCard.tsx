// IdeaCard — carte d'idée (composant central d'IdeaStream).
//
// Utilisé dans :
//   - Dashboard "Trending Ideas" (variant 'compact', carrousel mobile)
//   - Idea Wall (variant 'standard', grid desktop / liste mobile)
//
// Anatomie :
//   ┌──┬──────────────────────────────┐
//   │S │ [Category] [Status] [Sprint] │  ← chips header
//   │t │                              │
//   │a │ TITLE (h3, font-display)     │
//   │t │ Description tronquée…        │
//   │u │                              │
//   │s │ AvatarGroup    UpvoteButton  │  ← footer
//   └──┴──────────────────────────────┘
//   ↑ border-left 4px coloured by status
//
// Server Component par défaut ; UpvoteButton est un Client encapsulé.

import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import { clsx } from 'clsx';
import type { Idea } from '@/types/ideastream';
import { AvatarGroup } from '../ui/AvatarGroup';
import { CategoryChip } from './CategoryChip';
import { StatusBadge, statusColorMap } from './StatusBadge';
import { UpvoteButton } from './UpvoteButton';

export type IdeaCardVariant = 'compact' | 'standard';

export interface IdeaCardProps {
  idea: Idea;
  variant?: IdeaCardVariant;
  /** Si fourni, transforme la carte en lien vers ce path (ex: /idea/[id]). */
  href?: string;
  /** Affiche le menu kebab (3 dots) — uniquement en variant 'standard'. */
  showMenu?: boolean;
  className?: string;
}

const statusBorderColor: Record<string, string> = {
  primary: 'border-l-primary',
  secondary: 'border-l-secondary',
  tertiary: 'border-l-tertiary',
  neutral: 'border-l-outline',
  error: 'border-l-error',
};

export function IdeaCard({
  idea,
  variant = 'standard',
  href,
  showMenu = false,
  className,
}: IdeaCardProps) {
  const borderColor = statusBorderColor[statusColorMap[idea.status]];

  // Liste d'avatars combine author + contributors (author en premier).
  const stackedUsers = [idea.author, ...idea.contributors];

  const containerClassName = clsx(
    'group relative flex flex-col',
    'bg-surface-container-lowest rounded-lg overflow-hidden',
    'border border-outline-variant/40 border-l-4',
    borderColor,
    'shadow-soft hover:shadow-soft-md transition-shadow',
    variant === 'compact' ? 'p-4 gap-3' : 'p-5 gap-4',
    href && 'cursor-pointer',
    className,
  );

  const cardContent = (
    <>
      {/* Header : chips + sprint + menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center flex-wrap gap-2">
          <CategoryChip category={idea.category} />
          <StatusBadge status={idea.status} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {idea.sprint ? (
            <span className="text-label-sm text-on-surface-variant whitespace-nowrap">
              Sprint {idea.sprint.number}
            </span>
          ) : null}
          {showMenu ? (
            <button
              type="button"
              aria-label="More actions"
              className={clsx(
                'p-1 rounded-full text-on-surface-variant',
                'hover:bg-surface-container hover:text-on-surface transition-colors',
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <MoreVertical className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Title + description */}
      <div className="flex flex-col gap-1.5">
        <h3
          className={clsx(
            'font-display font-bold text-on-surface',
            variant === 'compact' ? 'text-body-lg' : 'text-headline-md',
            'line-clamp-2',
          )}
        >
          {idea.title}
        </h3>
        <p
          className={clsx(
            'text-body-sm text-on-surface-variant',
            variant === 'compact' ? 'line-clamp-2' : 'line-clamp-3',
          )}
        >
          {idea.description}
        </p>
      </div>

      {/* Footer : avatars + upvote */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <AvatarGroup users={stackedUsers} max={3} size="sm" />
        <UpvoteButton
          count={idea.upvotesCount}
          isActive={idea.hasUserVoted}
          variant="compact"
        />
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={containerClassName}>
        {cardContent}
      </Link>
    );
  }
  return <div className={containerClassName}>{cardContent}</div>;
}
