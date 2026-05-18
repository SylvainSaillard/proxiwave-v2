// AchievementsList — card "Recent Achievements" (Dashboard).
//
// Affiche jusqu'à 3 achievements débloqués + un lien "View All Badges".
// Items grisés s'ils ne sont pas encore unlocked.

import Link from 'next/link';
import { ArrowRight, Rocket, Crown, Users as UsersIcon, Zap, MessageCircle, Sparkles, type LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import type { Achievement } from '@/types/ideastream';

const iconRegistry: Record<string, LucideIcon> = {
  Rocket,
  Crown,
  Users: UsersIcon,
  Zap,
  MessageCircle,
  Sparkles,
};

const colorClass: Record<NonNullable<Achievement['color']>, string> = {
  primary: 'bg-primary-fixed text-primary',
  secondary: 'bg-secondary-fixed text-secondary',
  tertiary: 'bg-tertiary-fixed text-tertiary',
  neutral: 'bg-surface-container text-on-surface-variant',
  error: 'bg-error-container text-error',
};

export interface AchievementsListProps {
  achievements: Achievement[];
  /** Nombre max affiché avant "View All". */
  max?: number;
  viewAllHref?: string;
  className?: string;
}

export function AchievementsList({
  achievements,
  max = 3,
  viewAllHref = '/ideastream/achievements',
  className,
}: AchievementsListProps) {
  const visible = achievements.slice(0, max);

  return (
    <section
      className={clsx(
        'bg-surface-container-lowest rounded-lg p-5 md:p-6',
        'border border-outline-variant/40 shadow-soft',
        'flex flex-col gap-4',
        className,
      )}
    >
      <header className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-headline-md text-on-surface">
          Achievements
        </h2>
        <Link
          href={viewAllHref}
          className="text-label-md text-primary font-semibold hover:underline inline-flex items-center gap-1"
        >
          View All Badges
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </header>

      <ul className="flex flex-col gap-3">
        {visible.map((achievement) => (
          <AchievementBadgeItem
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </ul>
    </section>
  );
}

interface AchievementBadgeItemProps {
  achievement: Achievement;
}

function AchievementBadgeItem({ achievement }: AchievementBadgeItemProps) {
  const Icon = iconRegistry[achievement.icon] ?? Rocket;
  const unlocked = Boolean(achievement.unlockedAt);

  return (
    <li className="flex items-start gap-3">
      <span
        className={clsx(
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
          unlocked ? colorClass[achievement.color] : 'bg-surface-container text-on-surface-variant/60',
        )}
      >
        <Icon className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
      </span>

      <div className="flex flex-col">
        <span
          className={clsx(
            'text-label-lg font-semibold',
            unlocked ? 'text-on-surface' : 'text-on-surface-variant',
          )}
        >
          {achievement.name}
        </span>
        <span className="text-label-sm text-on-surface-variant">
          {achievement.description}
        </span>
      </div>
    </li>
  );
}
