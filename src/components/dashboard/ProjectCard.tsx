'use client';
// T033 — ProjectCard — identique prototype, données réelles

import Link from 'next/link';
import { MoreVertical, Clock } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { ProgressBar } from '@/components/ui';
import type { Project } from '@/types/app';

function getProgressColor(progress: number) {
  if (progress >= 70) return 'bg-pw-500';
  if (progress >= 40) return 'bg-sky-400';
  return 'bg-pw-200';
}

function getCardBg(progress: number) {
  if (progress >= 70) return 'bg-pw-50';
  if (progress >= 40) return 'bg-sky-50';
  return 'bg-warm-50';
}

function getAvatarBorder(progress: number) {
  if (progress >= 70) return 'border-pw-50';
  if (progress >= 40) return 'border-sky-50';
  return 'border-warm-50';
}

interface ProjectCardProps {
  project: Project;
  teamMembers?: { initials: string; avatar_color: string }[];
}

export default function ProjectCard({ project, teamMembers = [] }: ProjectCardProps) {
  const cardBg = getCardBg(project.progress);
  const avatarBorder = getAvatarBorder(project.progress);

  return (
    <Link
      href={`/dashboard/project/${project.id}`}
      className={cn(
        'rounded-bento p-6 flex flex-col justify-between gap-5 group hover:scale-[1.01] transition-all duration-300 cursor-pointer block',
        cardBg
      )}
    >
      {/* Top — date + menu */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">
          {formatDate(project.start_date)}
        </span>
        <button
          onClick={(e) => e.preventDefault()}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Center — name + category */}
      <div>
        <h3 className="text-base font-bold text-gray-900 leading-tight">{project.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{project.category}</p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500">Progress</span>
          <span className="text-xs font-bold text-gray-700">{project.progress}%</span>
        </div>
        <ProgressBar
          value={project.progress}
          barColor={getProgressColor(project.progress)}
          trackColor="bg-white/80"
        />
      </div>

      {/* Bottom — team avatars + deadline */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {teamMembers.slice(0, 4).map((member, i) => (
            <div
              key={i}
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2',
                avatarBorder
              )}
              style={{ backgroundColor: member.avatar_color }}
            >
              {member.initials}
            </div>
          ))}
        </div>
        {project.end_date && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-[11px] font-semibold text-gray-600">
            <Clock className="h-3 w-3" />
            {formatDate(project.end_date)}
          </span>
        )}
      </div>
    </Link>
  );
}
