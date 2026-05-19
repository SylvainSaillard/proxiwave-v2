// ActivityHistoryTimeline — historique chronologique des actions sur
// l'idee : moves de statut, votes notables, threads ouverts.
//
// Variante condensee de CommunityPulseFeed, scoped a une seule idee.

import Link from 'next/link';
import { ArrowRight, ArrowUp, MessageSquarePlus, Trophy, type LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { RelativeTime } from '@/components/ideastream/ui/RelativeTime';
import type { ActivityLogEntry, IdeaSemanticColor } from '@/types/ideastream';

const verbIcons: Partial<Record<ActivityLogEntry['verb'], { icon: LucideIcon; color: IdeaSemanticColor }>> = {
  upvoted: { icon: ArrowUp, color: 'secondary' },
  commented: { icon: MessageSquarePlus, color: 'primary' },
  approved_idea: { icon: Trophy, color: 'tertiary' },
  shipped_idea: { icon: Trophy, color: 'tertiary' },
  created_idea: { icon: ArrowUp, color: 'secondary' },
  unlocked_achievement: { icon: Trophy, color: 'secondary' },
  reached_streak: { icon: Trophy, color: 'secondary' },
  reached_xp_milestone: { icon: Trophy, color: 'primary' },
};

const colorClass: Record<IdeaSemanticColor, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
  neutral: 'bg-outline',
  error: 'bg-error',
};

export interface ActivityHistoryTimelineProps {
  entries: ActivityLogEntry[];
  viewAllHref?: string;
  className?: string;
}

export function ActivityHistoryTimeline({
  entries,
  viewAllHref,
  className,
}: ActivityHistoryTimelineProps) {
  return (
    <section
      className={clsx(
        'bg-surface-container-lowest rounded-lg p-5 md:p-6',
        'border border-outline-variant/40 shadow-soft',
        'flex flex-col gap-4',
        className,
      )}
    >
      <h2 className="font-display font-semibold text-headline-md text-on-surface">
        Activity History
      </h2>

      {entries.length === 0 ? (
        <p className="text-body-sm text-on-surface-variant text-center py-4">
          No activity yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3 relative">
          {entries.map((entry, index) => (
            <TimelineItem
              key={entry.id}
              entry={entry}
              isLast={index === entries.length - 1}
            />
          ))}
        </ul>
      )}

      {viewAllHref ? (
        <Link
          href={viewAllHref}
          className="self-start inline-flex items-center gap-1 text-label-md text-primary font-semibold hover:underline"
        >
          View All Logs
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      ) : null}
    </section>
  );
}

interface TimelineItemProps {
  entry: ActivityLogEntry;
  isLast: boolean;
}

function TimelineItem({ entry }: TimelineItemProps) {
  const descriptor = verbIcons[entry.verb];
  if (!descriptor) return null;
  const Icon = descriptor.icon;

  return (
    <li className="flex items-start gap-3">
      <span
        className={clsx(
          'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
          colorClass[descriptor.color],
          'text-on-secondary',
        )}
      >
        <Icon className="w-3.5 h-3.5" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <div className="flex flex-col min-w-0">
        <p className="text-body-sm text-on-surface">
          <strong className="font-semibold">{entry.actor.name}</strong>{' '}
          <ActivityVerbText entry={entry} />
        </p>
        <span className="text-label-sm text-on-surface-variant">
          <RelativeTime date={entry.createdAt} />
        </span>
      </div>
    </li>
  );
}

function ActivityVerbText({ entry }: { entry: ActivityLogEntry }) {
  switch (entry.verb) {
    case 'upvoted':
      return <>upvoted the idea</>;
    case 'commented':
      return <>added a comment</>;
    case 'approved_idea':
      return <>moved it to Approval</>;
    case 'shipped_idea':
      return <>shipped the idea</>;
    case 'created_idea':
      return <>kicked off the idea</>;
    case 'unlocked_achievement':
      return <>unlocked an achievement</>;
    case 'reached_streak':
      return <>reached a new streak</>;
    case 'reached_xp_milestone':
      return <>hit an XP milestone</>;
    default:
      return null;
  }
}
