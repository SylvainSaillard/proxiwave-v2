// TeamDiscussion — fil de commentaires de l'Idea Detail.
//
// Section :
//   - Titre "Team Discussion"
//   - Composer (textarea + bouton "Post Contribution") — desactive en
//     MVP lecture seule.
//   - Liste recursive de CommentThread.

import { Send } from 'lucide-react';
import { clsx } from 'clsx';
import { Avatar } from '@/components/ideastream/ui/Avatar';
import { RelativeTime } from '@/components/ideastream/ui/RelativeTime';
import type { GamifiedProfile, IdeaComment } from '@/types/ideastream';

export interface TeamDiscussionProps {
  viewer: GamifiedProfile;
  comments: IdeaComment[];
  className?: string;
}

export function TeamDiscussion({ viewer, comments, className }: TeamDiscussionProps) {
  return (
    <section
      className={clsx(
        'bg-surface-container-lowest rounded-lg p-5 md:p-6',
        'border border-outline-variant/40 shadow-soft',
        'flex flex-col gap-5',
        className,
      )}
    >
      <h2 className="font-display font-semibold text-headline-md text-on-surface">
        Team Discussion
      </h2>

      {/* Composer (desactive) */}
      <div className="flex items-start gap-3">
        <Avatar user={viewer} size="sm" />
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            placeholder="Add a collaborative thought or feedback…"
            disabled
            rows={2}
            className={clsx(
              'w-full p-3 rounded-md resize-none',
              'bg-surface-container-low text-body-sm text-on-surface',
              'placeholder:text-on-surface-variant',
              'border border-transparent focus:border-primary focus:outline-none',
              'disabled:cursor-not-allowed',
            )}
          />
          <div className="flex justify-end">
            <button
              type="button"
              disabled
              className={clsx(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full',
                'bg-secondary text-on-secondary text-label-md font-semibold',
                'shadow-secondary-glow',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              Post Contribution
            </button>
          </div>
        </div>
      </div>

      {/* Thread */}
      {comments.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentThread key={comment.id} comment={comment} />
          ))}
        </ul>
      ) : (
        <p className="text-body-sm text-on-surface-variant text-center py-4">
          Be the first to share your thoughts.
        </p>
      )}
    </section>
  );
}

interface CommentThreadProps {
  comment: IdeaComment;
  depth?: number;
}

function CommentThread({ comment, depth = 0 }: CommentThreadProps) {
  return (
    <li
      className={clsx(
        depth > 0 && 'ml-6 md:ml-10 pl-4 border-l-2 border-outline-variant',
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar user={comment.author} size="sm" />
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-label-lg font-semibold text-on-surface">
              {comment.author.name}
            </span>
            <span className="text-label-sm text-on-surface-variant">
              <RelativeTime date={comment.createdAt} />
            </span>
          </div>
          <p className="text-body-sm text-on-surface">{comment.content}</p>
          <button
            type="button"
            className="self-start text-label-sm text-primary font-semibold hover:underline mt-1"
          >
            Reply
          </button>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-4">
          {comment.replies.map((reply) => (
            <CommentThread key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
