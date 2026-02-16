import { MoreVertical, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import type { Project } from './mockData';

const progressColors: Record<string, string> = {
  high: 'bg-pw-500',
  mid: 'bg-sky-400',
  low: 'bg-pw-200',
};

function getProgressColor(progress: number) {
  if (progress >= 70) return progressColors.high;
  if (progress >= 40) return progressColors.mid;
  return progressColors.low;
}

function getCardBg(progress: number) {
  if (progress >= 70) return 'bg-pw-50';
  if (progress >= 40) return 'bg-sky-50';
  return 'bg-warm-50';
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/dashboard/project/${project.id}`}
      className={cn(
        'rounded-bento p-6 flex flex-col justify-between gap-5 group hover:scale-[1.01] transition-all duration-300 cursor-pointer block',
        getCardBg(project.progress)
      )}
    >
      {/* Top — date + menu */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">{project.date}</span>
        <button className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors">
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
        <div className="h-2 w-full rounded-full bg-white/80 overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-700', getProgressColor(project.progress))}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Bottom — team avatars + deadline */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.team.map((member, i) => (
            <div
              key={i}
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2',
                member.color,
                getCardBg(project.progress) === 'bg-pw-50'
                  ? 'border-pw-50'
                  : getCardBg(project.progress) === 'bg-sky-50'
                  ? 'border-sky-50'
                  : 'border-warm-50'
              )}
            >
              {member.initials}
            </div>
          ))}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-[11px] font-semibold text-gray-600">
          <Clock className="h-3 w-3" />
          {project.deadline}
        </span>
      </div>
    </Link>
  );
}
