// ProjectCard — card projet pour la vue Projects Overview.
//
// Border-left 8px coloree (selon project.color), chip categorie en
// haut, titre, description, progress bar, AvatarGroup, chevron-right.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { Chip } from '@/components/ideastream/ui/Chip';
import { AvatarGroup } from '@/components/ideastream/ui/AvatarGroup';
import type { IdeaSemanticColor, IdeaStreamProject } from '@/types/ideastream';

const borderColor: Record<IdeaSemanticColor, string> = {
  primary: 'border-l-primary',
  secondary: 'border-l-secondary',
  tertiary: 'border-l-tertiary',
  neutral: 'border-l-outline',
  error: 'border-l-error',
};

const progressBarColor: Record<IdeaSemanticColor, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
  neutral: 'bg-outline',
  error: 'bg-error',
};

export interface ProjectCardProps {
  project: IdeaStreamProject;
  href?: string;
  className?: string;
}

export function ProjectCard({ project, href, className }: ProjectCardProps) {
  const content = (
    <>
      {/* Header : chip + % */}
      <div className="flex items-center justify-between gap-2">
        <Chip
          label={project.category.toUpperCase()}
          color={project.color}
          size="sm"
        />
        <span className="text-label-lg font-bold text-on-surface tabular-nums">
          {project.progressPct}%
        </span>
      </div>

      {/* Titre + description */}
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display font-bold text-headline-md text-on-surface">
          {project.name}
        </h3>
        <p className="text-body-sm text-on-surface-variant line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
        <div
          className={clsx('h-full rounded-full', progressBarColor[project.color])}
          style={{ width: `${project.progressPct}%` }}
          role="progressbar"
          aria-valuenow={project.progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Avatars + chevron */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <AvatarGroup users={project.teamMembers} max={3} size="sm" />
        <ArrowRight
          className="w-5 h-5 text-on-surface-variant group-hover:text-on-surface transition-colors"
          aria-hidden="true"
        />
      </div>
    </>
  );

  const wrapperClasses = clsx(
    'group relative flex flex-col gap-3',
    'bg-surface-container-lowest rounded-lg overflow-hidden',
    'border border-outline-variant/40 border-l-[6px]',
    borderColor[project.color],
    'shadow-soft hover:shadow-soft-md transition-shadow',
    'p-5',
    className,
  );

  if (href) {
    return (
      <Link href={href} className={wrapperClasses}>
        {content}
      </Link>
    );
  }
  return <div className={wrapperClasses}>{content}</div>;
}
