// InnovationCycleHero — card violette large.
//
// Affiche le sprint actif : nom ("Innovation Cycle #12"), velocity
// score (78%), tasks completion (14/18) avec progress bar, avatars
// equipe. CTA "View Sprint Board".

import { ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { AvatarGroup } from '@/components/ideastream/ui/AvatarGroup';
import type { IdeaStreamSprint, IdeaUser } from '@/types/ideastream';

export interface InnovationCycleHeroProps {
  sprint: IdeaStreamSprint;
  team: IdeaUser[];
  className?: string;
}

export function InnovationCycleHero({
  sprint,
  team,
  className,
}: InnovationCycleHeroProps) {
  const taskPct = Math.round((sprint.tasksCompleted / sprint.tasksTotal) * 100);
  const cycleLabel = sprint.name ?? `Sprint ${sprint.number}`;

  return (
    <section
      className={clsx(
        'relative overflow-hidden',
        'bg-secondary-gradient text-white',
        'rounded-xl p-6 md:p-8',
        'shadow-secondary-glow',
        'flex flex-col gap-5',
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-label-md font-semibold uppercase tracking-wider text-white/80">
            Current Sprint · Week 2
          </span>
          <h2 className="font-display font-bold text-headline-lg lg:text-display-lg-mobile">
            {cycleLabel}
          </h2>
        </div>

        {/* Velocity Score */}
        <div className="flex flex-col items-end shrink-0">
          <span className="font-display font-bold text-display-lg-mobile lg:text-display-lg tabular-nums leading-none">
            {sprint.velocityScore}%
          </span>
          <span className="text-label-md text-white/80 mt-1">
            Velocity Score
          </span>
        </div>
      </header>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-label-md text-white/80">Task Completion</span>
          <span className="text-label-lg font-bold tabular-nums">
            {sprint.tasksCompleted}/{sprint.tasksTotal} Tasks Done
          </span>
        </div>
        <div className="relative h-2 rounded-full bg-white/20 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-white rounded-full transition-[width]"
            style={{ width: `${taskPct}%` }}
            role="progressbar"
            aria-valuenow={sprint.tasksCompleted}
            aria-valuemin={0}
            aria-valuemax={sprint.tasksTotal}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-2">
        <AvatarGroup users={team} max={4} size="md" />
        <button
          type="button"
          className={clsx(
            'inline-flex items-center gap-2 px-5 py-2.5 rounded-full',
            'bg-white text-secondary text-label-lg font-semibold',
            'shadow-soft hover:shadow-soft-lg transition-shadow',
          )}
        >
          View Sprint Board
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
