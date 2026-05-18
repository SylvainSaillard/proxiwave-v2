// UpvoteButton — bouton compteur de votes pour une idée.
//
// MVP lecture seule : pas d'action onClick par défaut, juste l'état
// visuel (ThumbsUp rempli si l'utilisateur a déjà voté).
// Quand on activera l'écriture, on passera `onClick` + optimistic UI.

'use client';

import { clsx } from 'clsx';
import { ThumbsUp } from 'lucide-react';

export interface UpvoteButtonProps {
  count: number;
  isActive: boolean;
  /** Variant visuel.
   *  - 'compact' : icon + count en ligne (cartes Idea Wall mobile)
   *  - 'stacked' : count au-dessus de l'icône (Idea Detail mobile)
   *  - 'pill' : pill horizontale large (Idea Detail desktop hero)
   */
  variant?: 'compact' | 'stacked' | 'pill';
  /** Si fourni, rend le bouton interactif (override MVP read-only). */
  onClick?: () => void;
  className?: string;
}

export function UpvoteButton({
  count,
  isActive,
  variant = 'compact',
  onClick,
  className,
}: UpvoteButtonProps) {
  const isReadOnly = !onClick;

  const baseClasses = clsx(
    'inline-flex items-center justify-center transition-colors',
    isActive
      ? 'text-secondary'
      : 'text-on-surface-variant hover:text-on-surface',
    !isReadOnly && 'cursor-pointer',
    className,
  );

  if (variant === 'stacked') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={isReadOnly}
        aria-label={isActive ? `Unvote (${count} upvotes)` : `Upvote (${count})`}
        aria-pressed={isActive}
        className={clsx(
          baseClasses,
          'flex-col gap-1 px-3 py-2 rounded-lg',
          'bg-surface-container-low hover:bg-surface-container',
        )}
      >
        <ThumbsUp
          className="w-5 h-5"
          strokeWidth={isActive ? 2.4 : 1.8}
          fill={isActive ? 'currentColor' : 'none'}
          aria-hidden="true"
        />
        <span className="text-label-md font-bold tabular-nums">{count}</span>
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={isReadOnly}
        aria-label={isActive ? `Unvote (${count} upvotes)` : `Upvote (${count})`}
        aria-pressed={isActive}
        className={clsx(
          baseClasses,
          'gap-2 px-5 py-2.5 rounded-full',
          isActive
            ? 'bg-secondary text-on-secondary shadow-secondary-glow'
            : 'bg-surface-container-low hover:bg-surface-container',
        )}
      >
        <ThumbsUp
          className="w-4 h-4"
          strokeWidth={2}
          fill={isActive ? 'currentColor' : 'none'}
          aria-hidden="true"
        />
        <span className="text-label-lg font-semibold tabular-nums">{count}</span>
      </button>
    );
  }

  // 'compact' (default)
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isReadOnly}
      aria-label={isActive ? `Unvote (${count} upvotes)` : `Upvote (${count})`}
      aria-pressed={isActive}
      className={clsx(baseClasses, 'gap-1.5 px-2 py-1 rounded-md')}
    >
      <ThumbsUp
        className="w-4 h-4"
        strokeWidth={isActive ? 2.4 : 1.8}
        fill={isActive ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
      <span className="text-label-md font-semibold tabular-nums">{count}</span>
    </button>
  );
}
