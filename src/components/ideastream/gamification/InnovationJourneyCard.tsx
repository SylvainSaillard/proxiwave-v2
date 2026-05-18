// InnovationJourneyCard — niveau actuel + XP bar vers le milestone.
//
// Card claire, sub-header "Innovation Journey", titre du niveau,
// progression XP avec milestone (ex: "450 / 500 XP — 90% Complete"),
// éventuellement chip "Visionary" pour la promotion en cours.

import { clsx } from 'clsx';
import type { GamifiedProfile } from '@/types/ideastream';

export interface InnovationJourneyCardProps {
  profile: GamifiedProfile;
  className?: string;
}

export function InnovationJourneyCard({
  profile,
  className,
}: InnovationJourneyCardProps) {
  // XP "dans le niveau courant" : on calcule la fenêtre [prev → next].
  // Pour le MVP, on suppose un palier de 500 XP par niveau pour simplifier.
  // Plus tard : courbe non-linéaire côté DB.
  const xpStep = 500;
  const xpInLevel = profile.xpPoints % xpStep;
  const xpForNext = xpStep;
  const progressPct = Math.round((xpInLevel / xpForNext) * 100);

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
          Innovation Journey
        </h2>
        <span className="text-label-md text-secondary font-semibold">
          Level {profile.level}: {profile.levelTitle}
        </span>
      </header>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-label-md text-on-surface-variant">
            Next Milestone: {nextMilestoneLabel(profile.levelTitle)}
          </span>
          <span className="text-body-lg font-display font-bold text-on-surface tabular-nums">
            {xpInLevel} / {xpForNext} XP
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 rounded-full bg-surface-container-high overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-tertiary rounded-full transition-[width]"
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={xpInLevel}
            aria-valuemin={0}
            aria-valuemax={xpForNext}
            aria-label={`${progressPct}% Complete`}
          />
        </div>

        <div className="text-label-sm text-tertiary font-semibold">
          {progressPct}% Complete
        </div>
      </div>
    </section>
  );
}

function nextMilestoneLabel(currentTitle: GamifiedProfile['levelTitle']) {
  // Mapping minimal : title courant → titre suivant à débloquer.
  const next: Record<GamifiedProfile['levelTitle'], string> = {
    Newcomer: 'Contributor Master',
    Contributor: 'Innovator Master',
    Innovator: 'Visionary Master',
    Visionary: 'Innovator Master',
    'Master Tinkerer': 'Mythic Tinkerer',
  };
  return next[currentTitle];
}
