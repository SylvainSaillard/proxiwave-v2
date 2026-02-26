'use client';
// T033 — Vue liste des projets — toggle grille/liste, stats bar

import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProjectCard from './ProjectCard';
import type { Project, DashboardStats } from '@/types/app';

interface ProjectsViewClientProps {
  projects: Project[];
  stats: DashboardStats;
}

export default function ProjectsViewClient({ projects, stats }: ProjectsViewClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8 pt-6">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Mes projets</h1>
        <span className="text-sm text-gray-400 font-medium">
          {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-gray-900">{stats.en_cours}</span>
          <span className="text-xs text-gray-400 font-medium leading-tight">en cours</span>
        </div>
        <span className="hidden sm:block h-5 w-px bg-warm-200" />
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-gray-900">{stats.termine}</span>
          <span className="text-xs text-gray-400 font-medium leading-tight">terminés</span>
        </div>
        <span className="hidden sm:block h-5 w-px bg-warm-200" />
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-gray-900">{stats.a_venir}</span>
          <span className="text-xs text-gray-400 font-medium leading-tight">à venir</span>
        </div>
        <span className="hidden sm:block h-5 w-px bg-warm-200" />
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-pw-600">{stats.total}</span>
          <span className="text-xs text-gray-400 font-medium leading-tight">au total</span>
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

      {/* Project cards */}
      {projects.length === 0 ? (
        <div className="rounded-bento bg-warm-50 border border-warm-100 p-12 text-center">
          <p className="text-sm font-semibold text-gray-500">Aucun projet pour le moment</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
