// SprintWidgetMobile — widget vue raccourcie du sprint actif.
//
// Maquette mobile uniquement (md:hidden). Affiche :
//   - bolt icon + "Active Sprint" + numero
//   - 3 chips d'idees en cours (Lightbulb/Network/Style icons)
//   - tasks X/Y completion avec progress
//   - CTAs "Open Sprint Board" + "Daily Standup"

import { Zap, Lightbulb, Network, Palette, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import type { Idea, IdeaStreamSprint } from '@/types/ideastream';

const ideaChipIcons = [Lightbulb, Network, Palette];

export interface SprintWidgetMobileProps {
  sprint: IdeaStreamSprint;
  ideas: Idea[];
  className?: string;
}

export function SprintWidgetMobile({
  sprint,
  ideas,
  className,
}: SprintWidgetMobileProps) {
  const taskPct = Math.round((sprint.tasksCompleted / sprint.tasksTotal) * 100);
  const visibleIdeas = ideas.slice(0, 3);

  return (
    <section
      className={clsx(
        'md:hidden',
        'bg-surface-container-lowest rounded-lg p-5',
        'border border-outline-variant/40 shadow-soft',
        'flex flex-col gap-4',
        className,
      )}
    >
      <header className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center">
          <Zap className="w-5 h-5" strokeWidth={2} fill="currentColor" aria-hidden="true" />
        </span>
        <div className="flex flex-col">
          <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
            Active Sprint
          </span>
          <span className="font-display font-bold text-headline-md text-on-surface">
            #{sprint.number}
          </span>
        </div>
      </header>

      {/* Idea chips en cours */}
      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
          Ideas in flight
        </span>
        <ul className="flex flex-col gap-2">
          {visibleIdeas.map((idea, index) => {
            const Icon = ideaChipIcons[index % ideaChipIcons.length];
            return (
              <li
                key={idea.id}
                className="flex items-center gap-2 p-2 rounded-md bg-surface-container-low"
              >
                <span className="w-7 h-7 rounded-md bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="text-label-md text-on-surface truncate">
                  {idea.title}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Tasks completion */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between">
          <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
            Task Completion
          </span>
          <span className="text-label-lg font-bold tabular-nums">
            {sprint.tasksCompleted}/{sprint.tasksTotal}
          </span>
        </div>
        <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
          <div
            className="h-full bg-tertiary rounded-full"
            style={{ width: `${taskPct}%` }}
          />
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className={clsx(
            'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full',
            'bg-secondary text-on-secondary text-label-lg font-semibold',
            'shadow-secondary-glow',
          )}
        >
          Open Sprint Board
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={clsx(
            'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full',
            'bg-surface-container-low text-on-surface text-label-lg font-semibold',
            'hover:bg-surface-container transition-colors',
          )}
        >
          Daily Standup
        </button>
      </div>
    </section>
  );
}
