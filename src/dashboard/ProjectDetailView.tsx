import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getProjectDetail } from './projectDetailData';
import type { Sprint, Idea, Task, ProjectMessage } from './projectDetailData';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

/* ── Types ── */
type TabKey = 'tasks' | 'ideas' | 'messages' | 'sprints' | 'documents';

/* ── Helpers ── */

function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: 'bg-warm-100', text: 'text-gray-600', label: 'Nouvelle' },
    reviewing: { bg: 'bg-sky-100', text: 'text-pw-600', label: 'En revue' },
    accepted: { bg: 'bg-pw-100', text: 'text-pw-700', label: 'Acceptée' },
    rejected: { bg: 'bg-red-50', text: 'text-red-600', label: 'Refusée' },
    validated: { bg: 'bg-pw-50', text: 'text-pw-600', label: 'Validé' },
    in_progress: { bg: 'bg-sky-50', text: 'text-sky-600', label: 'En cours' },
    delivered: { bg: 'bg-green-50', text: 'text-green-700', label: 'Livré' },
    completed: { bg: 'bg-green-50', text: 'text-green-700', label: 'Terminé' },
    active: { bg: 'bg-pw-100', text: 'text-pw-700', label: 'Actif' },
    upcoming: { bg: 'bg-warm-100', text: 'text-gray-600', label: 'À venir' },
  };
  const s = map[status] || map.new;
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider', s.bg, s.text)}>
      {s.label}
    </span>
  );
}

function satisfactionEmoji(score: number) {
  if (score >= 4.5) return '😍';
  if (score >= 4) return '😊';
  if (score >= 3) return '🙂';
  return '😐';
}

/* ── Subcomponents ── */

function ProgressRing({ progress, size = 120 }: { progress: number; size?: number }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8F4FD" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1976D2"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-gray-900">{progress}%</span>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Progression</span>
      </div>
    </div>
  );
}

function KpiTab({ value, label, icon: Icon, active, accent, iconColor, onClick }: {
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

/* ── Timeline Panel (default — Tasks) ── */

function TaskTimeline({ tasks, t }: { tasks: Task[]; t: (k: string) => string }) {
  const maxWeek = Math.max(...tasks.map((tk) => tk.startWeek + tk.durationWeeks));
  const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1);

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <Zap className="h-5 w-5 text-pw-500" />
        <h2 className="text-lg font-bold text-gray-900">{t('project.tab_tasks')}</h2>
      </div>

      <div className="rounded-bento bg-warm-50 p-5 overflow-x-auto">
        {/* Week headers */}
        <div className="flex items-center gap-0 mb-4" style={{ minWidth: `${maxWeek * 100}px` }}>
          <div className="w-44 shrink-0" />
          {weeks.map((w) => (
            <div key={w} className="flex-1 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              S{w}
            </div>
          ))}
        </div>

        {/* Task rows */}
        <div className="space-y-2" style={{ minWidth: `${maxWeek * 100}px` }}>
          {tasks.map((task) => {
            const leftPercent = ((task.startWeek - 1) / maxWeek) * 100;
            const widthPercent = (task.durationWeeks / maxWeek) * 100;

            const barColor =
              task.status === 'delivered'
                ? 'bg-green-400'
                : task.status === 'in_progress'
                ? 'bg-pw-500'
                : 'bg-warm-200';

            const barBg =
              task.status === 'delivered'
                ? 'bg-green-100'
                : task.status === 'in_progress'
                ? 'bg-pw-100'
                : 'bg-warm-100';

            return (
              <div key={task.id} className="flex items-center gap-0">
                {/* Label */}
                <div className="w-44 shrink-0 flex items-center gap-2 pr-3">
                  <div className={cn('h-6 w-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0', task.assigneeColor)}>
                    {task.assigneeInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{task.title}</p>
                  </div>
                </div>

                {/* Gantt bar */}
                <div className="flex-1 relative h-8">
                  <div
                    className={cn('absolute top-1 h-6 rounded-full flex items-center overflow-hidden', barBg)}
                    style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                  >
                    <div
                      className={cn('h-full rounded-full transition-all duration-700', barColor)}
                      style={{ width: `${task.progress}%` }}
                    />
                    {/* Progress text + icon */}
                    <div className="absolute inset-0 flex items-center justify-end pr-2 gap-1">
                      {task.status === 'delivered' ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-700" />
                      ) : task.status === 'in_progress' ? (
                        <span className="text-[10px] font-bold text-pw-700">{task.progress}%</span>
                      ) : (
                        <Clock className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Ideas Panel ── */

function ideaStatusConfig(status: string) {
  const map: Record<string, { emoji: string; bg: string; border: string; badgeBg: string; badgeText: string; label: string; glow: string }> = {
    new:       { emoji: '✨', bg: 'bg-amber-50/60',  border: 'border-amber-200',  badgeBg: 'bg-amber-100',  badgeText: 'text-amber-700',  label: 'Nouvelle',  glow: '' },
    reviewing: { emoji: '🔍', bg: 'bg-sky-50/60',    border: 'border-sky-200',    badgeBg: 'bg-sky-100',    badgeText: 'text-sky-700',    label: 'En revue',  glow: '' },
    accepted:  { emoji: '🎉', bg: 'bg-green-50/60',  border: 'border-green-200',  badgeBg: 'bg-green-100',  badgeText: 'text-green-700',  label: 'Acceptée',  glow: 'shadow-sm shadow-green-200' },
    rejected:  { emoji: '💡', bg: 'bg-warm-50/60',   border: 'border-warm-200',   badgeBg: 'bg-warm-100',   badgeText: 'text-gray-600',   label: 'Notée',     glow: '' },
  };
  return map[status] || map.new;
}

function IdeasPanel({ ideas, ideasCount, t }: { ideas: Idea[]; ideasCount: number; t: (k: string) => string }) {
  const accepted = ideas.filter((i) => i.status === 'accepted').length;
  const reviewing = ideas.filter((i) => i.status === 'reviewing').length;
  const newIdeas = ideas.filter((i) => i.status === 'new').length;
  const acceptRate = ideasCount > 0 ? Math.round((accepted / ideasCount) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold text-gray-900">{t('project.ideas_title')}</h2>
        </div>
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-600">
          {ideasCount} {t('project.ideas_count')}
        </span>
      </div>

      {/* Stats ribbon — gamification */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-3 text-center">
          <p className="text-2xl font-extrabold text-green-700">{accepted}</p>
          <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mt-0.5">🎉 {t('project.ideas_accepted')}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 p-3 text-center">
          <p className="text-2xl font-extrabold text-sky-700">{reviewing}</p>
          <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mt-0.5">🔍 {t('project.ideas_reviewing')}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 p-3 text-center">
          <p className="text-2xl font-extrabold text-amber-700">{newIdeas}</p>
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-0.5">✨ {t('project.ideas_new')}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-pw-50 to-pw-100 border border-pw-200 p-3 text-center">
          <p className="text-2xl font-extrabold text-pw-700">{acceptRate}%</p>
          <p className="text-[10px] font-bold text-pw-600 uppercase tracking-wider mt-0.5">📊 {t('project.ideas_rate')}</p>
        </div>
      </div>

      {/* Idea cards */}
      <div className="space-y-3">
        {ideas.map((idea) => {
          const cfg = ideaStatusConfig(idea.status);
          return (
            <div
              key={idea.id}
              className={cn(
                'rounded-xl border-2 p-4 flex items-center gap-4 transition-all hover:scale-[1.005]',
                cfg.bg, cfg.border, cfg.glow
              )}
            >
              {/* Emoji indicator */}
              <div className="text-2xl shrink-0">{cfg.emoji}</div>

              {/* Author avatar */}
              <div className={cn('h-9 w-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0', idea.authorColor)}>
                {idea.authorInitials}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{idea.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{idea.author} · {idea.date}</p>
              </div>

              {/* Status badge */}
              <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shrink-0', cfg.badgeBg, cfg.badgeText)}>
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* CTA — encourage participation */}
      <div className="mt-5 rounded-xl bg-gradient-to-r from-amber-50 via-pw-50 to-sky-50 border-2 border-dashed border-amber-200 p-5 text-center">
        <p className="text-3xl mb-2">💡</p>
        <p className="text-sm font-bold text-gray-900 mb-1">{t('project.ideas_cta_title')}</p>
        <p className="text-xs text-gray-500 mb-4">{t('project.ideas_cta_subtitle')}</p>
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <input
            type="text"
            placeholder={t('project.ideas_cta_placeholder')}
            className="flex-1 rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
          />
          <button className="h-10 px-5 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-colors shrink-0">
            {t('project.ideas_cta_button')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Messages Panel ── */

function MessagesPanel({ messages, t }: { messages: ProjectMessage[]; t: (k: string) => string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare className="h-5 w-5 text-pw-500" />
        <h2 className="text-lg font-bold text-gray-900">{t('project.tab_messages')}</h2>
      </div>
      <div className="rounded-bento bg-warm-50 p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-3',
              msg.isClient ? 'flex-row' : 'flex-row-reverse'
            )}
          >
            <div className={cn('h-9 w-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0', msg.senderColor)}>
              {msg.senderInitials}
            </div>
            <div
              className={cn(
                'max-w-[70%] rounded-2xl px-4 py-3',
                msg.isClient
                  ? 'bg-white border border-warm-100 rounded-tl-sm'
                  : 'bg-pw-500 text-white rounded-tr-sm'
              )}
            >
              <p className={cn('text-sm', msg.isClient ? 'text-gray-900' : 'text-white')}>{msg.text}</p>
              <p className={cn('text-[10px] mt-1', msg.isClient ? 'text-gray-400' : 'text-pw-200')}>
                {msg.sender} · {msg.date}
              </p>
            </div>
          </div>
        ))}

        {/* Input placeholder */}
        <div className="flex items-center gap-3 pt-3 border-t border-warm-100">
          <input
            type="text"
            placeholder={t('project.message_placeholder')}
            className="flex-1 rounded-xl border border-warm-200 bg-white px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent"
          />
          <button className="h-10 w-10 rounded-xl bg-pw-500 text-white flex items-center justify-center hover:bg-pw-600 transition-colors shrink-0">
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Sprints Panel ── */

function SprintsPanel({ sprints, t }: { sprints: Sprint[]; t: (k: string) => string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="h-5 w-5 text-pw-500" />
        <h2 className="text-lg font-bold text-gray-900">{t('project.sprints_title')}</h2>
      </div>
      <div className="space-y-4">
        {sprints.map((sprint) => {
          const statusColors: Record<string, string> = {
            completed: 'border-green-200 bg-green-50/50',
            active: 'border-pw-200 bg-pw-50/50',
            upcoming: 'border-warm-200 bg-warm-50/50',
          };

          return (
            <div key={sprint.id} className={cn('rounded-bento border-2 p-5 transition-all', statusColors[sprint.status] || 'border-warm-200')}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{sprint.name}</span>
                  {statusBadge(sprint.status)}
                </div>
                <span className="text-xs text-gray-400">{sprint.startDate} → {sprint.endDate}</span>
              </div>

              <div className="h-2 w-full rounded-full bg-white/80 overflow-hidden mb-4">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', sprint.status === 'completed' ? 'bg-green-500' : 'bg-pw-500')}
                  style={{ width: `${sprint.progress}%` }}
                />
              </div>

              <div className="space-y-2">
                {sprint.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      {item.status === 'delivered' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : item.status === 'in_progress' ? (
                        <Zap className="h-4 w-4 text-pw-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-300" />
                      )}
                      <span className={cn('text-sm', item.status === 'delivered' ? 'text-gray-400 line-through' : 'text-gray-700')}>
                        {item.title}
                      </span>
                    </div>
                    {statusBadge(item.status)}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Receipt className="h-3.5 w-3.5" />
                  Facturation
                </div>
                <span className="text-sm font-bold text-gray-900">{sprint.invoiceAmount}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Documents Panel ── */

function docIcon(type: string) {
  const colors: Record<string, string> = {
    pdf: 'text-red-500',
    figma: 'text-purple-500',
    sheet: 'text-green-600',
    doc: 'text-pw-500',
  };
  return <FileText className={cn('h-5 w-5', colors[type] || 'text-gray-400')} />;
}

function DocumentsPanel({ documents, t }: { documents: { id: string; name: string; type: string; date: string; size: string }[]; t: (k: string) => string }) {
  const byType = documents.reduce<Record<string, number>>((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, {});

  const typeLabels: Record<string, { label: string; emoji: string; bg: string; border: string; text: string }> = {
    pdf:   { label: 'PDF',   emoji: '📄', bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700' },
    figma: { label: 'Figma', emoji: '🎨', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
    sheet: { label: 'Excel', emoji: '📊', bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700' },
    doc:   { label: 'Doc',   emoji: '📝', bg: 'bg-pw-50',     border: 'border-pw-200',     text: 'text-pw-700' },
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <FileText className="h-5 w-5 text-pw-500" />
        <h2 className="text-lg font-bold text-gray-900">{t('project.documents_title')}</h2>
      </div>

      {/* Type breakdown */}
      <div className="flex flex-wrap gap-3 mb-5">
        {Object.entries(byType).map(([type, count]) => {
          const cfg = typeLabels[type] || typeLabels.doc;
          return (
            <div key={type} className={cn('rounded-xl border px-4 py-2 flex items-center gap-2', cfg.bg, cfg.border)}>
              <span className="text-lg">{cfg.emoji}</span>
              <span className={cn('text-sm font-bold', cfg.text)}>{count}</span>
              <span className="text-xs text-gray-500">{cfg.label}</span>
            </div>
          );
        })}
      </div>

      {/* Document list */}
      <div className="rounded-bento bg-warm-50 border border-warm-100 divide-y divide-warm-100">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between px-5 py-4 group cursor-pointer hover:bg-warm-100/50 transition-colors">
            <div className="flex items-center gap-3">
              {docIcon(doc.type)}
              <div>
                <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                <p className="text-[10px] text-gray-400">{doc.date} · {doc.size}</p>
              </div>
            </div>
            <Download className="h-4 w-4 text-gray-300 group-hover:text-pw-500 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main View ── */

export default function ProjectDetailView() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const project = getProjectDetail(id || '');
  const [activeTab, setActiveTab] = useState<TabKey>('tasks');

  if (!project) {
    return (
      <div className="min-h-screen bg-cream flex p-3 sm:p-4 gap-4">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-white rounded-bento overflow-hidden border border-warm-100">
          <TopBar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">Projet introuvable</p>
              <Link to="/dashboard" className="text-sm text-pw-500 hover:underline mt-2 inline-block">
                ← Retour aux projets
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const deliveredPercent = Math.round((project.deliveredCount / project.totalTaskCount) * 100);

  const tabs: { key: TabKey; value: string | number; label: string; icon: React.ElementType; accent: string; iconColor: string }[] = [
    { key: 'ideas', value: project.ideasCount, label: t('project.tab_ideas'), icon: Lightbulb, accent: 'bg-amber-50', iconColor: 'text-amber-500' },
    { key: 'messages', value: project.messagesCount, label: t('project.tab_messages'), icon: MessageSquare, accent: 'bg-pw-50', iconColor: 'text-pw-500' },
    { key: 'tasks', value: project.inProgressCount, label: t('project.tab_tasks'), icon: Zap, accent: 'bg-sky-50', iconColor: 'text-sky-400' },
    { key: 'sprints', value: `${project.sprints.filter((s) => s.status !== 'upcoming').length}/${project.sprints.length}`, label: t('project.tab_sprints'), icon: Flag, accent: 'bg-green-50', iconColor: 'text-green-600' },
    { key: 'documents', value: project.documents.length, label: t('project.tab_documents'), icon: FileText, accent: 'bg-warm-50', iconColor: 'text-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-cream flex p-3 sm:p-4 gap-4">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-white rounded-bento overflow-hidden border border-warm-100">
        <TopBar />

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {/* Back + Title */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/dashboard"
              className="h-10 w-10 rounded-xl bg-warm-50 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-warm-100 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{project.name}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{project.client} · {project.category}</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2">
              <span className="text-2xl">{satisfactionEmoji(project.satisfactionScore)}</span>
              <div>
                <span className="text-lg font-extrabold text-gray-900">{project.satisfactionScore}</span>
                <span className="text-xs text-gray-400 ml-1">/5</span>
              </div>
            </div>
          </div>

          {/* ═══ ROW 1 — Progress Ring + KPI Tabs ═══ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
            {/* Big progress ring */}
            <div className="col-span-2 sm:col-span-1 lg:col-span-2 rounded-bento bg-white border-2 border-pw-100 p-6 flex items-center justify-center">
              <ProgressRing progress={project.overallProgress} />
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

          {/* ═══ ROW 2 — Delivery progress bar ═══ */}
          <div className="rounded-bento bg-gray-900 p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <Package className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-semibold text-white">{t('project.delivery_progress')}</span>
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
              <span className="text-lg font-extrabold text-white">{project.deliveredCount}</span>
              <span className="text-sm text-gray-400"> {t('project.delivery_of')} {project.totalTaskCount}</span>
              <span className="text-xs text-gray-500 ml-2">({deliveredPercent}%)</span>
            </div>
          </div>

          {/* ═══ ROW 3 — Dynamic section based on active tab ═══ */}
          {activeTab === 'tasks' && <TaskTimeline tasks={project.tasks} t={t} />}
          {activeTab === 'ideas' && <IdeasPanel ideas={project.ideas} ideasCount={project.ideasCount} t={t} />}
          {activeTab === 'messages' && <MessagesPanel messages={project.projectMessages} t={t} />}
          {activeTab === 'sprints' && <SprintsPanel sprints={project.sprints} t={t} />}
          {activeTab === 'documents' && <DocumentsPanel documents={project.documents} t={t} />}

        </div>
      </div>
    </div>
  );
}
