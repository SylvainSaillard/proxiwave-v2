'use client';
// T043-T058 — Vue détail projet — identique prototype

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  TrendingUp,
  CheckCircle2,
  Clock,
  Lightbulb,
  MessageSquare,
  Zap,
  Flag,
  Package,
  Receipt,
  FileText,
  Download,
  Calendar,
  Tag,
  ChevronRight,
  ArrowUpCircle,
  MinusCircle,
  Star,
  Pencil,
  Sparkles,
  Search,
  XCircle,
  BarChart3,
  ClipboardList,
  Palette,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn, formatDate, formatFileSize } from '@/lib/utils';
import { ProgressBar, ProgressRing, Badge } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { submitIdea, sendProjectMessage, updateIdeaStatus, updateIdeaPrepFields, updateTask } from '@/actions/project-detail';
import type {
  Project,
  Task,
  Subtask,
  Sprint,
  Idea,
  ProjectMessage,
  Document,
  TaskStatus,
  TaskPriority,
  SprintStatus,
  IdeaStatus,
  UserRole,
} from '@/types/app';

type TabKey = 'tasks' | 'ideas' | 'messages' | 'sprints' | 'documents';

/* ── Status badge helpers ── */

function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    validée:    { bg: 'bg-pw-50',    text: 'text-pw-600',   label: 'Validé' },
    en_cours:   { bg: 'bg-sky-50',   text: 'text-sky-600',  label: 'En cours' },
    livrée:     { bg: 'bg-green-50', text: 'text-green-700', label: 'Livré' },
    terminé:    { bg: 'bg-green-50', text: 'text-green-700', label: 'Terminé' },
    actif:      { bg: 'bg-pw-100',   text: 'text-pw-700',   label: 'Actif' },
    à_venir:    { bg: 'bg-warm-100', text: 'text-gray-600', label: 'À venir' },
    nouvelle:   { bg: 'bg-warm-100', text: 'text-gray-600', label: 'Nouvelle' },
    en_revue:   { bg: 'bg-sky-100',  text: 'text-pw-600',   label: 'En revue' },
    acceptée:   { bg: 'bg-pw-100',   text: 'text-pw-700',   label: 'Acceptée' },
    refusée:    { bg: 'bg-red-50',   text: 'text-red-600',  label: 'Refusée' },
    validé:     { bg: 'bg-pw-50',    text: 'text-pw-600',   label: 'Validé' },
    livré:      { bg: 'bg-green-50', text: 'text-green-700', label: 'Livré' },
  };
  const s = map[status] ?? { bg: 'bg-warm-100', text: 'text-gray-600', label: status };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider', s.bg, s.text)}>
      {s.label}
    </span>
  );
}

function satisfactionColor(score: number) {
  if (score >= 4.5) return 'text-green-500';
  if (score >= 4) return 'text-pw-500';
  if (score >= 3) return 'text-amber-500';
  return 'text-gray-400';
}

/* ── Priority helpers ── */

function priorityConfig(priority: TaskPriority) {
  const map = {
    haute:   { icon: ArrowUpCircle, color: 'text-red-500',   bg: 'bg-red-50',   label: 'Haute' },
    moyenne: { icon: MinusCircle,   color: 'text-amber-500', bg: 'bg-amber-50', label: 'Moyenne' },
    basse:   { icon: MinusCircle,   color: 'text-green-500', bg: 'bg-green-50', label: 'Basse' },
  };
  return map[priority] ?? map.moyenne;
}

/* ── KPI Tab ── */

function KpiTab({
  value, label, icon: Icon, active, accent, iconColor, onClick,
}: {
  value: string | number;
  label: string;
  icon: React.ElementType;
  active: boolean;
  accent: string;
  iconColor: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-bento p-5 flex flex-col gap-3 text-left transition-all duration-300 cursor-pointer',
        accent,
        active
          ? 'ring-2 ring-pw-500 shadow-lg shadow-pw-500/10 scale-[1.02]'
          : 'hover:scale-[1.01] hover:shadow-md opacity-80 hover:opacity-100'
      )}
    >
      <div className={cn('h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center', iconColor)}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</span>
      <span className="text-xs font-semibold text-gray-500 leading-tight">{label}</span>
    </button>
  );
}

/* ── Task Detail Panel ── */

function TaskDetailPanel({ task, onClose, projectId, userRole }: { task: Task; onClose: () => void; projectId: string; userRole: UserRole }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority,
    start_date: task.start_date ?? '',
    end_date: task.end_date ?? '',
    duration_weeks: task.duration_weeks.toString(),
    progress_pct: task.progress_pct.toString(),
  });
  const router = useRouter();

  const prio = priorityConfig(task.priority);
  const PrioIcon = prio.icon;
  const subtasks = task.subtasks ?? [];
  const doneCount = subtasks.filter((s) => s.is_done).length;
  const totalSubs = subtasks.length;
  const subtaskPercent = totalSubs > 0 ? Math.round((doneCount / totalSubs) * 100) : 0;

  function handleSave() {
    setFeedback(null);
    startTransition(async () => {
      const result = await updateTask(task.id, projectId, {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority as TaskPriority,
        start_date: form.start_date || undefined,
        end_date: form.end_date || undefined,
        duration_weeks: form.duration_weeks ? Number(form.duration_weeks) : undefined,
        progress_pct: form.progress_pct ? Number(form.progress_pct) : undefined,
      });
      if ('error' in result) {
        setFeedback(result.error);
      } else {
        setFeedback('Tâche mise à jour.');
        setIsEditing(false);
        router.refresh();
      }
    });
  }

  const canEdit = userRole === 'superadmin';

  return (
    <div className="overflow-hidden transition-all duration-300 ease-out">
      <div className="mx-2 mb-3 rounded-2xl bg-white border-2 border-pw-100 shadow-lg shadow-pw-500/5 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-gray-900">{task.title}</h3>
              {statusBadge(task.status)}
            </div>
            {task.description && (
              <p className="text-sm text-gray-500 leading-relaxed">{task.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {canEdit && !isEditing && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                className="h-8 w-8 rounded-lg bg-warm-50 hover:bg-warm-100 flex items-center justify-center text-gray-400 hover:text-pw-600 transition-colors"
                title="Modifier la tâche"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="h-8 w-8 rounded-lg bg-warm-50 hover:bg-warm-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Titre</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Statut</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as TaskStatus }))}
                  className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
                >
                  <option value="validée">Validée</option>
                  <option value="en_cours">En cours</option>
                  <option value="livrée">Livrée</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Priorité</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value as TaskPriority }))}
                  className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
                >
                  <option value="haute">Haute</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="basse">Basse</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Date début</label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
                  className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Date fin</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
                  className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Durée (semaines)</label>
                <input
                  type="number"
                  min={1}
                  value={form.duration_weeks}
                  onChange={(e) => setForm((p) => ({ ...p, duration_weeks: e.target.value }))}
                  className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Avancement (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.progress_pct}
                  onChange={(e) => setForm((p) => ({ ...p, progress_pct: e.target.value }))}
                  className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
                />
              </div>
            </div>
            {feedback && (
              <p className={cn('text-xs font-medium', feedback.startsWith('Tâche') ? 'text-green-600' : 'text-red-500')}>{feedback}</p>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isPending}
                className="rounded-lg bg-pw-500 px-4 py-2 text-xs font-bold text-white hover:bg-pw-600 transition-all disabled:opacity-50"
              >
                {isPending ? '...' : 'Enregistrer'}
              </button>
              <button
                onClick={() => { setIsEditing(false); setFeedback(null); }}
                className="rounded-lg border border-warm-200 px-4 py-2 text-xs font-medium text-gray-500 hover:bg-warm-50 transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="rounded-xl bg-warm-50 p-3 flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-sky-50 flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4 text-sky-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Période</p>
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {formatDate(task.start_date)} → {formatDate(task.end_date)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-warm-50 p-3 flex items-center gap-2.5">
                <div className={cn('h-8 w-8 rounded-full flex items-center justify-center shrink-0', prio.bg)}>
                  <PrioIcon className={cn('h-4 w-4', prio.color)} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Priorité</p>
                  <p className="text-xs font-bold text-gray-900">{prio.label}</p>
                </div>
              </div>

              <div className="rounded-xl bg-warm-50 p-3 flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-pw-50 flex items-center justify-center shrink-0">
                  <Zap className="h-4 w-4 text-pw-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Durée</p>
                  <p className="text-xs font-bold text-gray-900">{task.duration_weeks}s</p>
                </div>
              </div>

              <div className="rounded-xl bg-warm-50 p-3 flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <Flag className="h-4 w-4 text-green-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Avancement</p>
                  <p className="text-xs font-bold text-gray-900">{task.progress_pct}%</p>
                </div>
              </div>
            </div>

            {/* Subtasks + Tags */}
            <div className="flex flex-col sm:flex-row gap-4">
              {totalSubs > 0 && (
                <div className="flex-1 rounded-xl bg-warm-50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-900">Sous-tâches</p>
                    <span className="text-[10px] font-bold text-gray-400">{doneCount}/{totalSubs}</span>
                  </div>
                  <ProgressBar value={subtaskPercent} height="h-1.5" trackColor="bg-warm-200" />
                  <div className="space-y-2 mt-3">
                    {subtasks.map((sub) => (
                      <div key={sub.id} className="flex items-center gap-2">
                        <div className={cn(
                          'h-4 w-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors',
                          sub.is_done ? 'bg-pw-500 border-pw-500' : 'border-warm-300 bg-white'
                        )}>
                          {sub.is_done && (
                            <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={cn('text-xs', sub.is_done ? 'text-gray-400 line-through' : 'text-gray-700')}>
                          {sub.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {task.tags.length > 0 && (
                <div className="sm:w-48 rounded-xl bg-warm-50 p-4">
                  <p className="text-xs font-bold text-gray-900 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {task.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-pw-50 border border-pw-100 px-2.5 py-0.5 text-[10px] font-semibold text-pw-600">
                        <Tag className="h-2.5 w-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Task Timeline ── */

function TaskTimeline({ tasks, projectId, userRole }: { tasks: Task[]; projectId: string; userRole: UserRole }) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const maxWeek = Math.max(...tasks.map((t) => (t.start_week ? 1 : 1) + t.duration_weeks), 8);
  const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1);

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <Zap className="h-5 w-5 text-pw-500" />
        <h2 className="text-lg font-bold text-gray-900">Tâches</h2>
        <span className="text-xs text-gray-400 ml-2">Cliquez pour voir le détail</span>
      </div>

      <div className="rounded-bento bg-warm-50 p-5 overflow-x-auto">
        <div className="flex items-center gap-0 mb-4" style={{ minWidth: `${maxWeek * 100}px` }}>
          <div className="w-44 shrink-0" />
          {weeks.map((w) => (
            <div key={w} className="flex-1 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              S{w}
            </div>
          ))}
        </div>

        <div className="space-y-1" style={{ minWidth: `${maxWeek * 100}px` }}>
          {tasks.map((task) => {
            const startWeek = 1;
            const leftPercent = ((startWeek - 1) / maxWeek) * 100;
            const widthPercent = (task.duration_weeks / maxWeek) * 100;
            const isSelected = selectedTaskId === task.id;

            const barColor = task.status === 'livrée' ? 'bg-green-400'
              : task.status === 'en_cours' ? 'bg-pw-500' : 'bg-warm-200';
            const barBg = task.status === 'livrée' ? 'bg-green-100'
              : task.status === 'en_cours' ? 'bg-pw-100' : 'bg-warm-100';

            return (
              <div key={task.id}>
                <div
                  onClick={() => setSelectedTaskId(isSelected ? null : task.id)}
                  className={cn(
                    'flex items-center gap-0 rounded-xl px-2 py-1 cursor-pointer transition-all duration-200',
                    isSelected ? 'bg-white shadow-sm ring-1 ring-pw-200' : 'hover:bg-white/60'
                  )}
                >
                  <div className="w-44 shrink-0 flex items-center gap-2 pr-3">
                    <ChevronRight className={cn(
                      'h-3 w-3 text-gray-400 shrink-0 transition-transform duration-200',
                      isSelected && 'rotate-90 text-pw-500'
                    )} />
                    <div className="min-w-0">
                      <p className={cn(
                        'text-xs font-semibold truncate transition-colors',
                        isSelected ? 'text-pw-600' : 'text-gray-900'
                      )}>{task.title}</p>
                    </div>
                  </div>

                  <div className="flex-1 relative h-8">
                    <div
                      className={cn(
                        'absolute top-1 h-6 rounded-full flex items-center overflow-hidden transition-all duration-200',
                        barBg,
                        isSelected && 'ring-1 ring-pw-300'
                      )}
                      style={{ left: `${leftPercent}%`, width: `${Math.max(widthPercent, 8)}%` }}
                    >
                      <div
                        className={cn('h-full rounded-full transition-all duration-700', barColor)}
                        style={{ width: `${task.progress_pct}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-end pr-2 gap-1">
                        {task.status === 'livrée' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-700" />
                        ) : task.status === 'en_cours' ? (
                          <span className="text-[10px] font-bold text-pw-700">{task.progress_pct}%</span>
                        ) : (
                          <Clock className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <TaskDetailPanel task={task} onClose={() => setSelectedTaskId(null)} projectId={projectId} userRole={userRole} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Ideas Panel ── */

function ideaStatusConfig(status: IdeaStatus) {
  const map: Record<IdeaStatus, { icon: LucideIcon; iconColor: string; bg: string; border: string; badgeBg: string; badgeText: string; label: string; glow: string }> = {
    nouvelle: { icon: Sparkles,     iconColor: 'text-amber-500', bg: 'bg-amber-50/60', border: 'border-amber-200', badgeBg: 'bg-amber-100', badgeText: 'text-amber-700', label: 'Nouvelle', glow: '' },
    en_revue: { icon: Search,       iconColor: 'text-sky-500',   bg: 'bg-sky-50/60',   border: 'border-sky-200',   badgeBg: 'bg-sky-100',   badgeText: 'text-sky-700',   label: 'En revue', glow: '' },
    acceptée: { icon: CheckCircle2,  iconColor: 'text-green-500', bg: 'bg-green-50/60', border: 'border-green-200', badgeBg: 'bg-green-100', badgeText: 'text-green-700', label: 'Acceptée', glow: 'shadow-sm shadow-green-200' },
    refusée:  { icon: XCircle,      iconColor: 'text-gray-400',  bg: 'bg-warm-50/60',  border: 'border-warm-200',  badgeBg: 'bg-warm-100',  badgeText: 'text-gray-600',  label: 'Notée',    glow: '' },
  };
  return map[status] ?? map.nouvelle;
}

function getNextStatuses(status: IdeaStatus): { value: IdeaStatus; label: string; color: string }[] {
  const map: Record<string, { value: IdeaStatus; label: string; color: string }[]> = {
    nouvelle: [{ value: 'en_revue', label: 'Mettre en revue', color: 'bg-sky-500 hover:bg-sky-600' }],
    en_revue: [
      { value: 'acceptée', label: 'Accepter', color: 'bg-green-500 hover:bg-green-600' },
      { value: 'refusée', label: 'Refuser', color: 'bg-red-400 hover:bg-red-500' },
    ],
  };
  return map[status] ?? [];
}

function IdeaCard({ idea, projectId, userRole }: { idea: Idea; projectId: string; userRole: UserRole }) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showPrep, setShowPrep] = useState(false);
  const [prepForm, setPrepForm] = useState({
    start_date: idea.start_date ?? '',
    end_date: idea.end_date ?? '',
    priority: idea.priority ?? '',
    duration_weeks: idea.duration_weeks?.toString() ?? '',
  });
  const router = useRouter();
  const cfg = ideaStatusConfig(idea.status);
  const nextStatuses = userRole === 'superadmin' ? getNextStatuses(idea.status) : [];

  function handleStatusChange(newStatus: IdeaStatus) {
    setFeedback(null);
    startTransition(async () => {
      const result = await updateIdeaStatus(idea.id, newStatus, projectId);
      if ('error' in result) {
        setFeedback(result.error);
      } else {
        if (result.taskCreated) {
          setFeedback('Idée acceptée — tâche créée !');
        }
        router.refresh();
      }
    });
  }

  function handleSavePrep() {
    setFeedback(null);
    startTransition(async () => {
      const result = await updateIdeaPrepFields(idea.id, projectId, {
        start_date: prepForm.start_date || undefined,
        end_date: prepForm.end_date || undefined,
        priority: (prepForm.priority as TaskPriority) || undefined,
        duration_weeks: prepForm.duration_weeks ? Number(prepForm.duration_weeks) : undefined,
      });
      if ('error' in result) {
        setFeedback(result.error);
      } else {
        setFeedback('Préparation enregistrée.');
        setShowPrep(false);
        router.refresh();
      }
    });
  }

  const isSuperadmin = userRole === 'superadmin';
  const canEditPrep = isSuperadmin && (idea.status === 'en_revue' || idea.status === 'nouvelle');

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-4 flex flex-col gap-3 transition-all hover:scale-[1.005]',
        cfg.bg, cfg.border, cfg.glow
      )}
    >
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 rounded-lg bg-white/70 flex items-center justify-center shrink-0">
              <cfg.icon className={cn('h-5 w-5', cfg.iconColor)} />
            </div>
        {idea.author && (
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
            style={{ backgroundColor: idea.author.avatar_color }}
          >
            {idea.author.initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{idea.title}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {idea.author?.full_name} · {formatDate(idea.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {canEditPrep && (
            <button
              onClick={() => setShowPrep(!showPrep)}
              className="h-7 w-7 rounded-lg bg-white/70 border border-warm-200 flex items-center justify-center text-gray-400 hover:text-pw-600 hover:border-pw-300 transition-all"
              title="Préparer la tâche"
            >
              <Pencil className="h-3 w-3" />
            </button>
          )}
          <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider', cfg.badgeBg, cfg.badgeText)}>
            {cfg.label}
          </span>
        </div>
      </div>

      {showPrep && (
        <div className="ml-12 rounded-xl bg-white border border-warm-200 p-4 space-y-3">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Préparation tâche</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">Date début</label>
              <input
                type="date"
                value={prepForm.start_date}
                onChange={(e) => setPrepForm((p) => ({ ...p, start_date: e.target.value }))}
                className="w-full rounded-lg border border-warm-200 px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">Date fin</label>
              <input
                type="date"
                value={prepForm.end_date}
                onChange={(e) => setPrepForm((p) => ({ ...p, end_date: e.target.value }))}
                className="w-full rounded-lg border border-warm-200 px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">Priorité</label>
              <select
                value={prepForm.priority}
                onChange={(e) => setPrepForm((p) => ({ ...p, priority: e.target.value }))}
                className="w-full rounded-lg border border-warm-200 px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
              >
                <option value="">—</option>
                <option value="haute">Haute</option>
                <option value="moyenne">Moyenne</option>
                <option value="basse">Basse</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">Durée (semaines)</label>
              <input
                type="number"
                min={1}
                value={prepForm.duration_weeks}
                onChange={(e) => setPrepForm((p) => ({ ...p, duration_weeks: e.target.value }))}
                className="w-full rounded-lg border border-warm-200 px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSavePrep}
              disabled={isPending}
              className="rounded-lg bg-pw-500 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-pw-600 transition-all disabled:opacity-50"
            >
              {isPending ? '...' : 'Enregistrer'}
            </button>
            <button
              onClick={() => setShowPrep(false)}
              className="rounded-lg border border-warm-200 px-3 py-1.5 text-[11px] font-medium text-gray-500 hover:bg-warm-50 transition-all"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {!showPrep && (idea.priority || idea.start_date || idea.duration_weeks) && (
        <div className="flex items-center gap-3 pl-12 flex-wrap">
          {idea.priority && (
            <span className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
              idea.priority === 'haute' ? 'bg-red-50 text-red-600' :
              idea.priority === 'moyenne' ? 'bg-amber-50 text-amber-600' :
              'bg-green-50 text-green-600'
            )}>
              {idea.priority === 'haute' ? '↑' : idea.priority === 'basse' ? '↓' : '−'} {idea.priority.charAt(0).toUpperCase() + idea.priority.slice(1)}
            </span>
          )}
          {idea.start_date && (
            <span className="text-[10px] text-gray-400">
              {formatDate(idea.start_date)}{idea.end_date ? ` → ${formatDate(idea.end_date)}` : ''}
            </span>
          )}
          {idea.duration_weeks && (
            <span className="text-[10px] text-gray-400">{idea.duration_weeks}s</span>
          )}
        </div>
      )}

      {nextStatuses.length > 0 && (
        <div className="flex items-center gap-2 pl-12">
          {nextStatuses.map((ns) => (
            <button
              key={ns.value}
              onClick={() => handleStatusChange(ns.value)}
              disabled={isPending}
              className={cn(
                'rounded-lg px-3 py-1.5 text-[11px] font-bold text-white transition-all disabled:opacity-50',
                ns.color
              )}
            >
              {isPending ? '...' : ns.label}
            </button>
          ))}
        </div>
      )}

      {feedback && (
        <p className="text-[11px] font-medium text-green-600 pl-12">{feedback}</p>
      )}
    </div>
  );
}

function IdeasPanel({ ideas, projectId, userRole }: { ideas: Idea[]; projectId: string; userRole: UserRole }) {
  const accepted = ideas.filter((i) => i.status === 'acceptée').length;
  const reviewing = ideas.filter((i) => i.status === 'en_revue').length;
  const newIdeas = ideas.filter((i) => i.status === 'nouvelle').length;
  const acceptRate = ideas.length > 0 ? Math.round((accepted / ideas.length) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold text-gray-900">Idées</h2>
        </div>
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-600">
          {ideas.length} idées
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-3 text-center">
          <p className="text-2xl font-extrabold text-green-700">{accepted}</p>
          <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1"><CheckCircle2 className="h-3 w-3" /> Acceptées</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 p-3 text-center">
          <p className="text-2xl font-extrabold text-sky-700">{reviewing}</p>
          <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1"><Search className="h-3 w-3" /> En revue</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 p-3 text-center">
          <p className="text-2xl font-extrabold text-amber-700">{newIdeas}</p>
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1"><Sparkles className="h-3 w-3" /> Nouvelles</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-pw-50 to-pw-100 border border-pw-200 p-3 text-center">
          <p className="text-2xl font-extrabold text-pw-700">{acceptRate}%</p>
          <p className="text-[10px] font-bold text-pw-600 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1"><BarChart3 className="h-3 w-3" /> Taux</p>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} projectId={projectId} userRole={userRole} />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-5 rounded-xl bg-gradient-to-r from-amber-50 via-pw-50 to-sky-50 border-2 border-dashed border-amber-200 p-5 text-center">
        <div className="flex justify-center mb-2"><Lightbulb className="h-8 w-8 text-amber-400" /></div>
        <p className="text-sm font-bold text-gray-900 mb-1">Vous avez une idée ?</p>
        <p className="text-xs text-gray-500 mb-4">Partagez-la avec votre équipe</p>
        <form action={submitIdea} className="flex items-center gap-3 max-w-md mx-auto">
          <input type="hidden" name="project_id" value={projectId} />
          <input
            type="text"
            name="title"
            required
            placeholder="Décrivez votre idée..."
            className="flex-1 rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
          />
          <button
            type="submit"
            className="h-10 px-5 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-colors shrink-0"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Messages ── */

function MessagesTab({ messages, projectId }: { messages: ProjectMessage[]; projectId: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare className="h-5 w-5 text-pw-500" />
        <h2 className="text-lg font-bold text-gray-900">Messages</h2>
      </div>
      <div className="rounded-bento bg-warm-50 p-5 space-y-4">
        {messages.map((msg) => {
          const isClient = msg.message_type === 'client';
          return (
            <div key={msg.id} className={cn('flex gap-3', isClient ? 'flex-row' : 'flex-row-reverse')}>
              {msg.author && (
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: msg.author.avatar_color }}
                >
                  {msg.author.initials}
                </div>
              )}
              <div className={cn(
                'max-w-[70%] rounded-2xl px-4 py-3',
                isClient ? 'bg-white border border-warm-100 rounded-tl-sm' : 'bg-pw-500 text-white rounded-tr-sm'
              )}>
                <p className={cn('text-sm', isClient ? 'text-gray-900' : 'text-white')}>{msg.content}</p>
                <p className={cn('text-[10px] mt-1', isClient ? 'text-gray-400' : 'text-pw-200')}>
                  {msg.author?.full_name} · {formatDate(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}

        <form action={sendProjectMessage} className="flex items-center gap-3 pt-3 border-t border-warm-100">
          <input type="hidden" name="project_id" value={projectId} />
          <input type="hidden" name="message_type" value="client" />
          <input
            type="text"
            name="content"
            required
            placeholder="Écrire un message..."
            className="flex-1 rounded-xl border border-warm-200 bg-white px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
          />
          <button
            type="submit"
            className="h-10 w-10 rounded-xl bg-pw-500 text-white flex items-center justify-center hover:bg-pw-600 transition-colors shrink-0"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Sprints ── */

function SprintsTab({ sprints }: { sprints: Sprint[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="h-5 w-5 text-pw-500" />
        <h2 className="text-lg font-bold text-gray-900">Sprints</h2>
      </div>
      <div className="space-y-4">
        {sprints.map((sprint) => {
          const statusColors: Record<SprintStatus, string> = {
            terminé: 'border-green-200 bg-green-50/50',
            actif:   'border-pw-200 bg-pw-50/50',
            à_venir: 'border-warm-200 bg-warm-50/50',
          };

          return (
            <div key={sprint.id} className={cn('rounded-bento border-2 p-5 transition-all', statusColors[sprint.status])}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{sprint.name}</span>
                  {statusBadge(sprint.status)}
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(sprint.start_date)} → {formatDate(sprint.end_date)}
                </span>
              </div>

              <ProgressBar
                value={sprint.progress_pct}
                barColor={sprint.status === 'terminé' ? 'bg-green-500' : 'bg-pw-500'}
                height="h-2"
                className="mb-4"
              />

              {sprint.items && (
                <div className="space-y-2">
                  {sprint.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        {item.status === 'livré' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : item.status === 'en_cours' ? (
                          <Zap className="h-4 w-4 text-pw-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-gray-300" />
                        )}
                        <span className={cn('text-sm', item.status === 'livré' ? 'text-gray-400 line-through' : 'text-gray-700')}>
                          {item.title}
                        </span>
                      </div>
                      {statusBadge(item.status)}
                    </div>
                  ))}
                </div>
              )}

              {sprint.billing_amount !== null && (
                <div className="mt-4 pt-3 border-t border-white/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Receipt className="h-3.5 w-3.5" />
                    Facturation
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {sprint.billing_amount.toLocaleString('fr-FR')} €
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Documents ── */

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

function DocumentsTab({ documents }: { documents: Document[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <FileText className="h-5 w-5 text-pw-500" />
        <h2 className="text-lg font-bold text-gray-900">Documents</h2>
      </div>
      <div className="rounded-bento bg-warm-50 border border-warm-100 divide-y divide-warm-100">
        {documents.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">Aucun document</p>
        ) : (
          documents.map((doc) => {
            const typeCfg = docTypeConfig[doc.file_type] ?? docTypeConfig.doc;
            return (
              <div key={doc.id} className="flex items-center justify-between px-5 py-4 group cursor-pointer hover:bg-warm-100/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', typeCfg.bg)}>
                    <FileText className={cn('h-5 w-5', typeCfg.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-[10px] text-gray-400">
                      {formatDate(doc.created_at)} · {formatFileSize(doc.file_size)}
                    </p>
                  </div>
                </div>
                <Download className="h-4 w-4 text-gray-300 group-hover:text-pw-500 transition-colors" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ── Main Component ── */

interface ProjectDetailClientProps {
  project: Project;
  tasks: Task[];
  sprints: Sprint[];
  ideas: Idea[];
  messages: ProjectMessage[];
  documents: Document[];
  userRole: UserRole;
}

export default function ProjectDetailClient({
  project,
  tasks,
  sprints,
  ideas,
  messages,
  documents,
  userRole,
}: ProjectDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('tasks');

  const inProgressCount = tasks.filter((t) => t.status === 'en_cours').length;
  const deliveredCount = tasks.filter((t) => t.status === 'livrée').length;
  const deliveredPercent = tasks.length > 0 ? Math.round((deliveredCount / tasks.length) * 100) : 0;

  const tabs: { key: TabKey; value: string | number; label: string; icon: React.ElementType; accent: string; iconColor: string }[] = [
    { key: 'ideas',     value: ideas.length,    label: 'Idées',     icon: Lightbulb,     accent: 'bg-amber-50', iconColor: 'text-amber-500' },
    { key: 'messages',  value: messages.length, label: 'Messages',  icon: MessageSquare, accent: 'bg-pw-50',    iconColor: 'text-pw-500' },
    { key: 'tasks',     value: inProgressCount, label: 'Tâches',    icon: Zap,           accent: 'bg-sky-50',   iconColor: 'text-sky-400' },
    { key: 'sprints',   value: `${sprints.filter((s) => s.status !== 'à_venir').length}/${sprints.length}`, label: 'Sprints', icon: Flag, accent: 'bg-green-50', iconColor: 'text-green-600' },
    { key: 'documents', value: documents.length, label: 'Documents', icon: FileText,      accent: 'bg-warm-50',  iconColor: 'text-gray-500' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-8">
      {/* Back + Title */}
      <div className="flex items-center gap-4 mb-8 pt-6">
        <Link
          href="/dashboard"
          className="h-10 w-10 rounded-xl bg-warm-50 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-warm-100 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{project.name}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{project.category}</p>
        </div>
        {project.satisfaction_score !== null && (
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <Star className={cn('h-6 w-6', satisfactionColor(project.satisfaction_score))} />
            <div>
              <span className="text-lg font-extrabold text-gray-900">{project.satisfaction_score}</span>
              <span className="text-xs text-gray-400 ml-1">/5</span>
            </div>
          </div>
        )}
      </div>

      {/* ROW 1 — Progress Ring + KPI Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
        <div className="col-span-2 sm:col-span-1 lg:col-span-2 rounded-bento bg-white border-2 border-pw-100 p-6 flex items-center justify-center">
          <ProgressRing progress={project.progress} />
        </div>
        {tabs.map((tab) => (
          <KpiTab
            key={tab.key}
            value={tab.value}
            label={tab.label}
            icon={tab.icon}
            active={activeTab === tab.key}
            accent={tab.accent}
            iconColor={tab.iconColor}
            onClick={() => setActiveTab(tab.key)}
          />
        ))}
      </div>

      {/* ROW 2 — Delivery progress */}
      <div className="rounded-bento bg-gray-900 p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <Package className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-semibold text-white">Progression livraison</span>
        </div>
        <div className="flex-1">
          <div className="h-3 w-full rounded-full bg-gray-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pw-400 to-green-400 transition-all duration-700"
              style={{ width: `${deliveredPercent}%` }}
            />
          </div>
        </div>
        <div className="flex items-baseline gap-1 shrink-0">
          <span className="text-lg font-extrabold text-white">{deliveredCount}</span>
          <span className="text-sm text-gray-400"> sur {tasks.length}</span>
          <span className="text-xs text-gray-500 ml-2">({deliveredPercent}%)</span>
        </div>
      </div>

      {/* ROW 3 — Dynamic section */}
      {activeTab === 'tasks'     && <TaskTimeline tasks={tasks} projectId={project.id} userRole={userRole} />}
      {activeTab === 'ideas'     && <IdeasPanel ideas={ideas} projectId={project.id} userRole={userRole} />}
      {activeTab === 'messages'  && <MessagesTab messages={messages} projectId={project.id} />}
      {activeTab === 'sprints'   && <SprintsTab sprints={sprints} />}
      {activeTab === 'documents' && <DocumentsTab documents={documents} />}
    </div>
  );
}
