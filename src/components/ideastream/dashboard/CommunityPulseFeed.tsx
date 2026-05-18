// CommunityPulseFeed — flux d'activité en temps réel du Dashboard.
//
// Liste verticale d'entrées (PulseItem) avec barre verticale couleur
// à gauche selon le type d'événement. Footer "Show more activity".
//
// L'écran mobile affiche ~5 entrées avec un bouton expand ; desktop
// peut en montrer plus.

import { Zap, Rocket, MessageCircle, ThumbsUp, Trophy, Flame, type LucideIcon, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { Avatar } from '@/components/ideastream/ui/Avatar';
import type { ActivityLogEntry, ActivityVerb, IdeaSemanticColor } from '@/types/ideastream';
import { RelativeTime } from '@/components/ideastream/ui/RelativeTime';

interface VerbDescriptor {
  icon: LucideIcon;
  color: IdeaSemanticColor;
}

const verbMap: Record<ActivityVerb, VerbDescriptor> = {
  upvoted: { icon: ThumbsUp, color: 'secondary' },
  commented: { icon: MessageCircle, color: 'primary' },
  created_idea: { icon: Zap, color: 'secondary' },
  approved_idea: { icon: Trophy, color: 'tertiary' },
  shipped_idea: { icon: Rocket, color: 'tertiary' },
  unlocked_achievement: { icon: Trophy, color: 'secondary' },
  reached_streak: { icon: Flame, color: 'secondary' },
  reached_xp_milestone: { icon: Zap, color: 'primary' },
};

const colorBgClass: Record<IdeaSemanticColor, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
  neutral: 'bg-outline',
  error: 'bg-error',
};

const colorTintClass: Record<IdeaSemanticColor, string> = {
  primary: 'bg-primary-fixed text-primary',
  secondary: 'bg-secondary-fixed text-secondary',
  tertiary: 'bg-tertiary-fixed text-tertiary',
  neutral: 'bg-surface-container text-on-surface-variant',
  error: 'bg-error-container text-error',
};

export interface CommunityPulseFeedProps {
  entries: ActivityLogEntry[];
  title?: string;
  /** Affiche un bouton "Show more activity" en bas. */
  showExpand?: boolean;
  className?: string;
}

export function CommunityPulseFeed({
  entries,
  title = 'Community Pulse',
  showExpand = true,
  className,
}: CommunityPulseFeedProps) {
  return (
    <section
      className={clsx(
        'bg-surface-container-lowest rounded-lg p-5 md:p-6',
        'border border-outline-variant/40 shadow-soft',
        'flex flex-col gap-4',
        className,
      )}
    >
      <h2 className="font-display font-bold text-headline-md text-on-surface">
        {title}
      </h2>

      <ul className="flex flex-col gap-4">
        {entries.map((entry) => (
          <PulseItem key={entry.id} entry={entry} />
        ))}
      </ul>

      {showExpand ? (
        <button
          type="button"
          className={clsx(
            'mt-2 inline-flex items-center justify-center gap-1.5',
            'text-label-md text-on-surface-variant hover:text-on-surface',
            'transition-colors',
          )}
        >
          Show more activity
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        </button>
      ) : null}
    </section>
  );
}

interface PulseItemProps {
  entry: ActivityLogEntry;
}

function PulseItem({ entry }: PulseItemProps) {
  const descriptor = verbMap[entry.verb];
  const Icon = descriptor.icon;

  return (
    <li className="flex items-start gap-3 relative pl-3">
      {/* Barre verticale colorée gauche */}
      <span
        className={clsx(
          'absolute left-0 top-1 bottom-1 w-0.5 rounded-full',
          colorBgClass[descriptor.color],
        )}
        aria-hidden="true"
      />

      {/* Icône ou avatar — selon le verbe */}
      {entry.verb === 'upvoted' || entry.verb === 'commented' ? (
        <Avatar user={entry.actor} size="sm" />
      ) : (
        <span
          className={clsx(
            'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
            colorTintClass[descriptor.color],
          )}
        >
          <Icon className="w-4 h-4" strokeWidth={1.8} aria-hidden="true" />
        </span>
      )}

      <div className="flex flex-col min-w-0">
        <p className="text-body-sm text-on-surface">
          <PulseSentence entry={entry} />
        </p>
        <span className="text-label-sm text-on-surface-variant mt-0.5">
          <RelativeTime date={entry.createdAt} />
        </span>
      </div>
    </li>
  );
}

interface PulseSentenceProps {
  entry: ActivityLogEntry;
}

function PulseSentence({ entry }: PulseSentenceProps) {
  const actor = <strong className="font-semibold">{entry.actor.name}</strong>;
  const target = entry.targetIdeaTitle ? (
    <span className="text-primary font-medium">“{entry.targetIdeaTitle}”</span>
  ) : null;

  switch (entry.verb) {
    case 'upvoted':
      return entry.targetUser ? (
        <>
          {actor} upvoted your idea {target}
        </>
      ) : (
        <>
          {actor} upvoted {target}
        </>
      );
    case 'commented':
      return entry.targetUser ? (
        <>
          {actor} commented on your idea {target}
        </>
      ) : (
        <>
          {actor} commented on {target}
        </>
      );
    case 'created_idea':
      return (
        <>
          {actor} just kicked off a new idea {target}
        </>
      );
    case 'approved_idea':
      return (
        <>
          {actor} approved {target}
        </>
      );
    case 'shipped_idea':
      return (
        <>
          {actor} shipped {target} 🚀
        </>
      );
    case 'unlocked_achievement':
      return (
        <>
          {actor} unlocked the{' '}
          <strong className="text-secondary">
            {entry.metadata?.achievementName}
          </strong>{' '}
          badge
        </>
      );
    case 'reached_streak':
      return (
        <>
          {actor} just reached a{' '}
          <strong className="text-secondary">
            {entry.metadata?.streakDays}-day collaboration streak
          </strong>
        </>
      );
    case 'reached_xp_milestone':
      return (
        <>
          {actor} just hit{' '}
          <strong className="text-primary">
            {entry.metadata?.points} innovation points!
          </strong>
        </>
      );
    default:
      return <>{actor} did something</>;
  }
}
