'use client';
// T059 — Vue Documents globale — identique prototype

import { useState } from 'react';
import { FileText, Download, Star, Search, Filter, Image, FolderOpen, Package, ClipboardList, Palette, BarChart3, Receipt, FolderClosed, Pen, ImageIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn, formatDate, formatFileSize } from '@/lib/utils';
import { EmptyState } from '@/components/ui';
import type { Document, Project } from '@/types/app';

const docTypeConfig: Record<string, { color: string; bg: string }> = {
  pdf:   { color: 'text-red-500',    bg: 'bg-red-50' },
  figma: { color: 'text-purple-500', bg: 'bg-purple-50' },
  sheet: { color: 'text-green-600',  bg: 'bg-green-50' },
  doc:   { color: 'text-pw-500',     bg: 'bg-pw-50' },
  image: { color: 'text-pink-500',   bg: 'bg-pink-50' },
};

const catConfig: Record<string, { label: string; icon: LucideIcon; bg: string; border: string; text: string }> = {
  livrable:      { label: 'Livrable',      icon: Package,       bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700' },
  spécification: { label: 'Spécification', icon: ClipboardList, bg: 'bg-pw-50',     border: 'border-pw-200',     text: 'text-pw-700' },
  design:        { label: 'Design',        icon: Palette,       bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  rapport:       { label: 'Rapport',       icon: BarChart3,     bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700' },
  facture:       { label: 'Facture',       icon: Receipt,       bg: 'bg-sky-50',    border: 'border-sky-200',    text: 'text-sky-700' },
};

const typeLabel: Record<string, { label: string; icon: LucideIcon }> = {
  pdf:   { label: 'PDF',   icon: FileText },
  figma: { label: 'Figma', icon: Palette },
  sheet: { label: 'Excel', icon: BarChart3 },
  doc:   { label: 'Doc',   icon: Pen },
  image: { label: 'Image', icon: ImageIcon },
};

interface DocumentsViewClientProps {
  documents: Document[];
  projects: Project[];
}

export default function DocumentsViewClient({ documents, projects }: DocumentsViewClientProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [starredOnly, setStarredOnly] = useState(false);

  const filtered = documents.filter((doc) => {
    if (search && !doc.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== 'all' && doc.category !== categoryFilter) return false;
    if (projectFilter !== 'all' && doc.project_id !== projectFilter) return false;
    if (starredOnly && !doc.is_favorite) return false;
    return true;
  });

  const totalDocs = documents.length;
  const starredDocs = documents.filter((d) => d.is_favorite).length;
  const byType = documents.reduce<Record<string, number>>((acc, d) => { acc[d.file_type] = (acc[d.file_type] || 0) + 1; return acc; }, {});
  const byCategory = documents.reduce<Record<string, number>>((acc, d) => { acc[d.category] = (acc[d.category] || 0) + 1; return acc; }, {});

  const groupedByProject = filtered.reduce<Record<string, Document[]>>((acc, doc) => {
    const project = projects.find((p) => p.id === doc.project_id);
    const name = project?.name ?? 'Autre';
    if (!acc[name]) acc[name] = [];
    acc[name].push(doc);
    return acc;
  }, {});

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Documents</h1>
          <p className="text-sm text-gray-400 mt-0.5">Tous vos livrables et fichiers projet</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-pw-50 px-3 py-1 text-xs font-bold text-pw-600">
          {totalDocs} documents
        </span>
      </div>

      {/* Stats KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="rounded-xl bg-gradient-to-br from-pw-50 to-pw-100 border border-pw-200 p-4 text-center">
          <p className="text-3xl font-extrabold text-pw-700">{totalDocs}</p>
          <p className="text-[10px] font-bold text-pw-600 uppercase tracking-wider mt-1 flex items-center justify-center gap-1"><FolderClosed className="h-3 w-3" /> Total</p>
        </div>
        <button
          onClick={() => setStarredOnly(!starredOnly)}
          className={cn(
            'rounded-xl border p-4 text-center transition-all cursor-pointer',
            starredOnly
              ? 'bg-amber-100 border-amber-300 ring-2 ring-amber-400 scale-[1.02]'
              : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:scale-[1.01]'
          )}
        >
          <p className="text-3xl font-extrabold text-amber-700">{starredDocs}</p>
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-1 flex items-center justify-center gap-1"><Star className="h-3 w-3" /> Favoris</p>
        </button>
        {Object.entries(byType).slice(0, 4).map(([type, count]) => {
          const tl = typeLabel[type] ?? { label: type, icon: FolderClosed };
          const TlIcon = tl.icon;
          return (
            <div key={type} className="rounded-xl bg-warm-50 border border-warm-100 p-4 text-center">
              <p className="text-3xl font-extrabold text-gray-800">{count}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1 flex items-center justify-center gap-1"><TlIcon className="h-3 w-3" /> {tl.label}</p>
            </div>
          );
        })}
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Filter className="h-4 w-4" />
          <span className="text-xs font-semibold">Filtrer par</span>
        </div>
        <button
          onClick={() => setCategoryFilter('all')}
          className={cn('rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all border', categoryFilter === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-warm-200 hover:border-gray-300')}
        >
          Tous
        </button>
        {Object.keys(catConfig).map((cat) => {
          const cfg = catConfig[cat];
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
              className={cn(
                'rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all border',
                categoryFilter === cat ? cn(cfg.bg, cfg.text, cfg.border) : 'bg-white text-gray-500 border-warm-200 hover:border-gray-300'
              )}
            >
              <cfg.icon className="h-3 w-3 inline-block" /> {cfg.label} <span className="ml-1 opacity-60">{byCategory[cat] || 0}</span>
            </button>
          );
        })}
      </div>

      {/* Search + Project filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un document..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-warm-200 bg-warm-50 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
          />
        </div>
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="rounded-xl border border-warm-200 bg-warm-50 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
        >
          <option value="all">Tous les projets</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Documents list */}
      {filtered.length === 0 ? (
        <EmptyState icon={FolderOpen} title="Aucun document trouvé" />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByProject).map(([projectName, docs]) => (
            <div key={projectName}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-pw-500" />
                <h3 className="text-sm font-bold text-gray-900">{projectName}</h3>
                <span className="text-[10px] text-gray-400 font-semibold">{docs.length} doc{docs.length > 1 ? 's' : ''}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {docs.map((doc) => {
                  const typeCfg = docTypeConfig[doc.file_type] ?? docTypeConfig.doc;
                  const catCfg = catConfig[doc.category] ?? catConfig.spécification;
                  return (
                    <div key={doc.id} className="group rounded-xl border-2 border-warm-100 bg-white p-4 hover:border-pw-200 hover:shadow-md hover:shadow-pw-500/5 transition-all cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', typeCfg.bg)}>
                          <FileText className={cn('h-5 w-5', typeCfg.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {formatDate(doc.created_at)} · {formatFileSize(doc.file_size)}
                          </p>
                        </div>
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <Star className={cn('h-4 w-4 transition-colors', doc.is_favorite ? 'text-amber-400 fill-amber-400' : 'text-gray-200 group-hover:text-gray-300')} />
                          <Download className="h-4 w-4 text-gray-200 group-hover:text-pw-500 transition-colors" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-warm-50">
                        <span className="text-[11px] text-gray-500">Document</span>
                        <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border', catCfg.bg, catCfg.text, catCfg.border)}>
                          <catCfg.icon className="h-3 w-3 inline-block" /> {catCfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
