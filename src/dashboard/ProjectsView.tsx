import { useTranslation } from 'react-i18next';
import { LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import { projects } from './mockData';
import ProjectCard from './ProjectCard';
import { cn } from '../lib/utils';

export default function ProjectsView() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const inProgress = projects.filter((p) => p.status === 'in_progress').length;
  const upcoming = projects.filter((p) => p.status === 'upcoming').length;
  const completed = projects.filter((p) => p.status === 'completed').length;
  const total = projects.length;

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          {t('dashboard.projects_title')}
        </h1>
        <span className="text-sm text-gray-400 font-medium">Janvier 2026</span>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-gray-900">{inProgress}</span>
          <span className="text-xs text-gray-400 font-medium leading-tight">
            {t('dashboard.stat_in_progress')}
          </span>
        </div>
        <span className="hidden sm:block h-5 w-px bg-warm-200" />
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-gray-900">{completed}</span>
          <span className="text-xs text-gray-400 font-medium leading-tight">
            {t('dashboard.stat_completed')}
          </span>
        </div>
        <span className="hidden sm:block h-5 w-px bg-warm-200" />
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-gray-900">{upcoming}</span>
          <span className="text-xs text-gray-400 font-medium leading-tight">
            {t('dashboard.stat_upcoming')}
          </span>
        </div>
        <span className="hidden sm:block h-5 w-px bg-warm-200" />
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-pw-600">{total}</span>
          <span className="text-xs text-gray-400 font-medium leading-tight">
            {t('dashboard.stat_total')}
          </span>
        </div>

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-1 bg-warm-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'h-8 w-8 rounded-lg flex items-center justify-center transition-all',
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'h-8 w-8 rounded-lg flex items-center justify-center transition-all',
              viewMode === 'grid'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Project cards grid */}
      <div
        className={cn(
          'gap-4',
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2'
            : 'flex flex-col'
        )}
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
