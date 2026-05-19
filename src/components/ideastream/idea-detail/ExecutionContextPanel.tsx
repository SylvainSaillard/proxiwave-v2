// ExecutionContextPanel — card "Execution Context" + ComplexityScore.
//
// Affiche les meta operationnelles de l'idee :
//   - Linked Project (chip cliquable)
//   - Sprint Cycle (avec numero)
//   - Estimated Delivery (date)
//   - Complexity Score (badge 0-10)

import Link from 'next/link';
import { Briefcase, Repeat, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import type { Idea } from '@/types/ideastream';

export interface ExecutionContextPanelProps {
  idea: Idea;
  className?: string;
}

export function ExecutionContextPanel({
  idea,
  className,
}: ExecutionContextPanelProps) {
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
        Execution Context
      </h2>

      <div className="flex flex-col gap-3">
        {/* Linked Project */}
        {idea.project ? (
          <ContextRow
            icon={Briefcase}
            label="Linked Project"
            value={idea.project.name}
            href={`/ideastream/projects#${idea.project.id}`}
          />
        ) : null}

        {/* Sprint Cycle */}
        {idea.sprint ? (
          <ContextRow
            icon={Repeat}
            label="Sprint Cycle"
            value={`Sprint ${idea.sprint.number} — ${capitalize(idea.sprint.status)}`}
          />
        ) : null}

        {/* Estimated Delivery */}
        {idea.estimatedDelivery ? (
          <ContextRow
            icon={Calendar}
            label="Est. Delivery"
            value={formatDate(idea.estimatedDelivery)}
          />
        ) : null}

        {/* Complexity Score */}
        {idea.complexityScore !== undefined ? (
          <div className="mt-2">
            <ComplexityScore score={idea.complexityScore} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------

import type { LucideIcon } from 'lucide-react';

interface ContextRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

function ContextRow({ icon: Icon, label, value, href }: ContextRowProps) {
  const valueEl = (
    <span className="text-label-lg font-semibold text-on-surface">
      {value}
    </span>
  );

  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-surface-container-low">
      <span className="w-8 h-8 rounded-md bg-primary-fixed text-primary flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div className="flex flex-col min-w-0">
        <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
          {label}
        </span>
        {href ? (
          <Link href={href} className="hover:underline">
            {valueEl}
          </Link>
        ) : (
          valueEl
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------

interface ComplexityScoreProps {
  score: number;
  max?: number;
}

function ComplexityScore({ score, max = 10 }: ComplexityScoreProps) {
  const pct = Math.round((score / max) * 100);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
          Complexity Score
        </span>
        <span className="text-label-lg font-bold text-on-surface tabular-nums">
          {score.toString().padStart(2, '0')}/{max}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-2 rounded-full bg-surface-container-high overflow-hidden"
      >
        <div
          className="h-full bg-gradient-to-r from-tertiary via-primary to-secondary rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
