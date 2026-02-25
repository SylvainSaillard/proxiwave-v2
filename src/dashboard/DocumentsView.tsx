import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Download,
  Star,
  Search,
  Filter,
  Image,
  FolderOpen,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { globalDocuments } from './mockData';
import type { GlobalDocument } from './mockData';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

/* ── Types ── */
type CategoryFilter = 'all' | 'deliverable' | 'spec' | 'design' | 'report' | 'invoice';
type ProjectFilter = string; // 'all' or projectId

/* ── Helpers ── */

function docTypeIcon(type: string) {
  const config: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    pdf:   { icon: FileText, color: 'text-red-500',    bg: 'bg-red-50' },
    figma: { icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
    sheet: { icon: FileText, color: 'text-green-600',  bg: 'bg-green-50' },
    doc:   { icon: FileText, color: 'text-pw-500',     bg: 'bg-pw-50' },
    image: { icon: Image,    color: 'text-pink-500',   bg: 'bg-pink-50' },
  };
  const cfg = config[type] || config.doc;
  const Icon = cfg.icon;
  return (
    <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', cfg.bg)}>
      <Icon className={cn('h-5 w-5', cfg.color)} />
    </div>
  );
}

function categoryConfig(cat: string) {
  const map: Record<string, { label: string; emoji: string; bg: string; border: string; text: string }> = {
    deliverable: { label: 'Livrable',     emoji: '📦', bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700' },
    spec:        { label: 'Spécification', emoji: '📋', bg: 'bg-pw-50',     border: 'border-pw-200',    text: 'text-pw-700' },
    design:      { label: 'Design',       emoji: '🎨', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
    report:      { label: 'Rapport',      emoji: '📊', bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-700' },
    invoice:     { label: 'Facture',      emoji: '🧾', bg: 'bg-sky-50',    border: 'border-sky-200',   text: 'text-sky-700' },
  };
  return map[cat] || map.spec;
}

function typeLabel(type: string) {
  const map: Record<string, { label: string; emoji: string }> = {
    pdf:   { label: 'PDF',   emoji: '📄' },
    figma: { label: 'Figma', emoji: '🎨' },
    sheet: { label: 'Excel', emoji: '📊' },
    doc:   { label: 'Doc',   emoji: '📝' },
    image: { label: 'Image', emoji: '🖼️' },
  };
  return map[type] || map.doc;
}

/* ── Main Component ── */

export default function DocumentsView() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all');
  const [starredOnly, setStarredOnly] = useState(false);

  // Unique projects
  const projects = Array.from(new Set(globalDocuments.map((d) => d.project))).map((name) => ({
    name,
    id: globalDocuments.find((d) => d.project === name)!.projectId,
  }));

  // Filter documents
  const filtered = globalDocuments.filter((doc) => {
    if (search && !doc.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== 'all' && doc.category !== categoryFilter) return false;
    if (projectFilter !== 'all' && doc.projectId !== projectFilter) return false;
    if (starredOnly && !doc.starred) return false;
    return true;
  });

  // Stats
  const totalDocs = globalDocuments.length;
  const starredDocs = globalDocuments.filter((d) => d.starred).length;
  const byType = globalDocuments.reduce<Record<string, number>>((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, {});
  const byCategory = globalDocuments.reduce<Record<string, number>>((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1;
    return acc;
  }, {});

  // Group filtered docs by project
  const groupedByProject = filtered.reduce<Record<string, GlobalDocument[]>>((acc, doc) => {
    if (!acc[doc.project]) acc[doc.project] = [];
    acc[doc.project].push(doc);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-cream flex p-3 sm:p-4 gap-4">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-white rounded-bento overflow-hidden border border-warm-100">
        <TopBar />

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{t('docs.title')}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{t('docs.subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-pw-50 px-3 py-1 text-xs font-bold text-pw-600">
                {totalDocs} {t('docs.total')}
              </span>
            </div>
          </div>

          {/* ═══ ROW 1 — Stats KPIs ═══ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {/* Total */}
            <div className="rounded-xl bg-gradient-to-br from-pw-50 to-pw-100 border border-pw-200 p-4 text-center">
              <p className="text-3xl font-extrabold text-pw-700">{totalDocs}</p>
              <p className="text-[10px] font-bold text-pw-600 uppercase tracking-wider mt-1">📁 {t('docs.stat_total')}</p>
            </div>

            {/* Starred */}
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
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-1">⭐ {t('docs.stat_starred')}</p>
            </button>

            {/* By type */}
            {Object.entries(byType).slice(0, 4).map(([type, count]) => {
              const tl = typeLabel(type);
              return (
                <div key={type} className="rounded-xl bg-warm-50 border border-warm-100 p-4 text-center">
                  <p className="text-3xl font-extrabold text-gray-800">{count}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">{tl.emoji} {tl.label}</p>
                </div>
              );
            })}
          </div>

          {/* ═══ ROW 2 — Category filter chips ═══ */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Filter className="h-4 w-4" />
              <span className="text-xs font-semibold">{t('docs.filter_by')}</span>
            </div>

            {/* Category chips */}
            <button
              onClick={() => setCategoryFilter('all')}
              className={cn(
                'rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all border',
                categoryFilter === 'all'
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-500 border-warm-200 hover:border-gray-300'
              )}
            >
              {t('docs.filter_all')}
            </button>
            {(['deliverable', 'spec', 'design', 'report', 'invoice'] as const).map((cat) => {
              const cfg = categoryConfig(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all border',
                    categoryFilter === cat
                      ? cn(cfg.bg, cfg.text, cfg.border, 'ring-1', `ring-${cfg.border.replace('border-', '')}`)
                      : 'bg-white text-gray-500 border-warm-200 hover:border-gray-300'
                  )}
                >
                  {cfg.emoji} {cfg.label} <span className="ml-1 opacity-60">{byCategory[cat] || 0}</span>
                </button>
              );
            })}
          </div>

          {/* ═══ ROW 3 — Search + Project filter ═══ */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('docs.search_placeholder')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-warm-200 bg-warm-50 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
              />
            </div>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="rounded-xl border border-warm-200 bg-warm-50 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
            >
              <option value="all">{t('docs.all_projects')}</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* ═══ ROW 4 — Documents grouped by project ═══ */}
          {filtered.length === 0 ? (
            <div className="rounded-bento bg-warm-50 border border-warm-100 p-12 text-center">
              <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-500">{t('docs.empty')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedByProject).map(([projectName, docs]) => (
                <div key={projectName}>
                  {/* Project header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-pw-500" />
                    <h3 className="text-sm font-bold text-gray-900">{projectName}</h3>
                    <span className="text-[10px] text-gray-400 font-semibold">{docs.length} doc{docs.length > 1 ? 's' : ''}</span>
                  </div>

                  {/* Doc cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {docs.map((doc) => {
                      const catCfg = categoryConfig(doc.category);
                      return (
                        <div
                          key={doc.id}
                          className="group rounded-xl border-2 border-warm-100 bg-white p-4 hover:border-pw-200 hover:shadow-md hover:shadow-pw-500/5 transition-all cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            {/* Type icon */}
                            {docTypeIcon(doc.type)}

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{doc.date} · {doc.size}</p>
                            </div>

                            {/* Star + Download */}
                            <div className="flex flex-col items-center gap-1 shrink-0">
                              <Star
                                className={cn(
                                  'h-4 w-4 transition-colors',
                                  doc.starred ? 'text-amber-400 fill-amber-400' : 'text-gray-200 group-hover:text-gray-300'
                                )}
                              />
                              <Download className="h-4 w-4 text-gray-200 group-hover:text-pw-500 transition-colors" />
                            </div>
                          </div>

                          {/* Footer: author + category badge */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-warm-50">
                            <div className="flex items-center gap-2">
                              <div className={cn('h-6 w-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white', doc.authorColor)}>
                                {doc.authorInitials}
                              </div>
                              <span className="text-[11px] text-gray-500">{doc.author}</span>
                            </div>
                            <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border', catCfg.bg, catCfg.text, catCfg.border)}>
                              {catCfg.emoji} {catCfg.label}
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
      </div>
    </div>
  );
}
