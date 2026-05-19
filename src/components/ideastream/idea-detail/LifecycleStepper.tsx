// LifecycleStepper — 4 etapes : Idea → Approval → Dev → Done.
//
// Cercles connectes par des lignes. Etat :
//   - complete : bg-tertiary + check
//   - active   : bg-secondary + icone metier (User pour Approval, Code pour Dev)
//   - pending  : border outline-variant, texte muted
//
// Variants : horizontal (par defaut), responsif (icones plus petites mobile).

import { Check, User, Code, CheckCheck, Lightbulb, type LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import type { LifecycleStage } from '@/types/ideastream';

const stageIcons: Record<LifecycleStage['id'], LucideIcon> = {
  idea: Lightbulb,
  approval: User,
  dev: Code,
  done: CheckCheck,
};

export interface LifecycleStepperProps {
  stages: LifecycleStage[];
  className?: string;
}

export function LifecycleStepper({ stages, className }: LifecycleStepperProps) {
  return (
    <div
      className={clsx(
        'flex items-center justify-between gap-0 w-full',
        className,
      )}
      role="progressbar"
      aria-label="Idea lifecycle"
    >
      {stages.map((stage, index) => (
        <StepWrapper key={stage.id} stage={stage} isLast={index === stages.length - 1} />
      ))}
    </div>
  );
}

function StepWrapper({ stage, isLast }: { stage: LifecycleStage; isLast: boolean }) {
  const Icon = stageIcons[stage.id];

  const circleClasses = clsx(
    'w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0',
    'transition-colors',
    stage.state === 'complete' && 'bg-tertiary text-on-tertiary',
    stage.state === 'active' && 'bg-secondary text-on-secondary shadow-secondary-glow',
    stage.state === 'pending' && 'border-2 border-outline-variant text-outline',
  );

  const labelClasses = clsx(
    'text-label-md font-semibold mt-2 text-center',
    stage.state === 'pending' ? 'text-on-surface-variant' : 'text-on-surface',
  );

  const connectorClasses = clsx(
    'flex-1 h-0.5 mx-2 transition-colors',
    stage.state === 'complete' ? 'bg-tertiary' : 'bg-outline-variant',
  );

  return (
    <>
      <div className="flex flex-col items-center">
        <div className={circleClasses}>
          {stage.state === 'complete' ? (
            <Check className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.4} aria-hidden="true" />
          ) : (
            <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} aria-hidden="true" />
          )}
        </div>
        <span className={labelClasses}>{stage.label}</span>
      </div>
      {!isLast ? <span className={connectorClasses} aria-hidden="true" /> : null}
    </>
  );
}

/**
 * Helper : derive les stages d'apres le statut courant d'une idee.
 */
export function deriveLifecycleStages(
  status: 'sandbox' | 'approved' | 'in_dev' | 'shipped' | 'rejected',
): LifecycleStage[] {
  const all: LifecycleStage[] = [
    { id: 'idea', label: 'Idea', state: 'pending' },
    { id: 'approval', label: 'Approval', state: 'pending' },
    { id: 'dev', label: 'Dev', state: 'pending' },
    { id: 'done', label: 'Done', state: 'pending' },
  ];

  if (status === 'rejected') {
    all[0].state = 'complete';
    return all;
  }

  // sandbox = Idea active
  all[0].state = status === 'sandbox' ? 'active' : 'complete';

  // approved = Approval active
  if (status === 'approved') all[1].state = 'active';
  else if (status === 'in_dev' || status === 'shipped') all[1].state = 'complete';

  // in_dev = Dev active
  if (status === 'in_dev') all[2].state = 'active';
  else if (status === 'shipped') all[2].state = 'complete';

  // shipped = Done complete
  if (status === 'shipped') all[3].state = 'complete';

  return all;
}
