'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Trophy,
  TrendingUp,
  BookOpen,
  Sparkles,
  Package,
  Flag,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  Project,
  Task,
  Sprint,
  Idea,
  ProjectMessage,
  Document,
  UserRole,
} from '@/types/app';

interface ProjectDashboardProps {
  projects: Project[];
  project: Project;
  tasks: Task[];
  sprints: Sprint[];
  ideas: Idea[];
  messages: ProjectMessage[];
  documents: Document[];
  userRole: UserRole;
}

const spring = { type: 'spring' as const, stiffness: 300, damping: 24 };
const bounceIn = { type: 'spring' as const, stiffness: 400, damping: 15 };

function statusBadge(status: string) {
  if (status === 'en_cours') return { label: 'En cours', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
  if (status === 'terminé') return { label: 'Terminé', bg: 'bg-pw-100', text: 'text-pw-700', dot: 'bg-pw-500' };
  return { label: 'À venir', bg: 'bg-warm-100', text: 'text-gray-500', dot: 'bg-gray-400' };
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={bounceIn}
    >
      {value}{suffix}
    </motion.span>
  );
}

export default function ProjectDashboard({
  projects,
  project,
  tasks,
  sprints,
  messages,
}: ProjectDashboardProps) {
  const router = useRouter();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const deliveredCount = tasks.filter((t) => t.status === 'livrée').length;
  const achievements = computeAchievements(tasks, sprints);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const badge = statusBadge(project.status);

  function handleProjectSwitch(id: string) {
    setSwitcherOpen(false);
    router.push(`/dashboard?project=${id}`);
  }

  return (
    <div className="flex flex-col h-full px-5 py-4 gap-4 overflow-hidden">

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ...spring }}
        className="rounded-2xl bg-gradient-to-r from-pw-500 via-violet-500 to-fuchsia-500 px-6 py-4 relative overflow-hidden shadow-lg shadow-pw-500/20 shrink-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-lg font-extrabold border border-white/30"
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={spring}
            >
              {project.name.slice(0, 2).toUpperCase()}
            </motion.div>
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center gap-2 text-white hover:text-white/90 transition-colors"
              >
                <h1 className="text-xl font-extrabold tracking-tight">{project.name}</h1>
                <motion.div animate={{ rotate: switcherOpen ? 180 : 0 }} transition={spring}>
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </button>
              <p className="text-sm text-white/70 font-semibold">{project.category}</p>

              <AnimatePresence>
                {switcherOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={spring}
                    className="absolute z-50 top-full left-0 mt-2 w-80 rounded-xl bg-white border border-warm-200 shadow-2xl overflow-hidden"
                  >
                    {projects.map((p, i) => {
                      const b = statusBadge(p.status);
                      return (
                        <motion.button
                          key={p.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          onClick={() => handleProjectSwitch(p.id)}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-pw-50 transition-colors',
                            p.id === project.id && 'bg-pw-50'
                          )}
                        >
                          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-pw-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                            {p.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.category}</p>
                          </div>
                          <span className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider', b.bg, b.text)}>
                            <span className={cn('h-2 w-2 rounded-full', b.dot)} />
                            {b.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.span
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-sm"
          >
            <span className={cn('h-2.5 w-2.5 rounded-full animate-pulse', badge.dot)} />
            {badge.label}
          </motion.span>
        </div>
      </motion.div>

      {/* ── KPIs: AVANCEMENT + LIVRAISONS ── */}
      <div className="grid grid-cols-2 gap-4 shrink-0">
        {[
          {
            icon: TrendingUp,
            gradient: 'from-emerald-400 to-green-500',
            label: 'Avancement',
            value: project.progress,
            total: 100,
            suffix: '%',
            lightBg: 'from-emerald-50 to-emerald-100',
          },
          {
            icon: Package,
            gradient: 'from-pw-400 to-pw-600',
            label: 'Livraisons',
            value: deliveredCount,
            total: tasks.length,
            suffix: '',
            lightBg: 'from-pw-50 to-sky-100',
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.1, ...spring }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={cn('rounded-2xl bg-gradient-to-br p-5 flex items-center gap-5 cursor-default shadow-md', kpi.lightBg)}
          >
            <motion.div
              className={cn('h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-lg', kpi.gradient)}
              whileHover={{ rotate: 8 }}
              transition={spring}
            >
              <kpi.icon className="h-7 w-7 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-gray-900">
                  <AnimatedNumber value={kpi.value} />
                </span>
                {kpi.suffix ? (
                  <span className="text-xl font-extrabold text-gray-300">{kpi.suffix}</span>
                ) : (
                  <span className="text-xl font-extrabold text-gray-300">/ {kpi.total}</span>
                )}
              </div>
              <div className="h-2 w-full rounded-full bg-white/60 mt-2 overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full bg-gradient-to-r', kpi.gradient)}
                  initial={{ width: 0 }}
                  animate={{ width: `${kpi.total > 0 ? Math.min(100, (kpi.value / kpi.total) * 100) : 0}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 + i * 0.15 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── ACHIEVEMENTS (3 cards) ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, ...spring }}
        className="rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 border border-gray-700/50 p-5 text-white shadow-xl shadow-gray-900/20 relative overflow-hidden shrink-0"
      >
        <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-tr-full" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Trophy className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-base font-extrabold tracking-tight">Achievements</h3>
                <p className="text-xs text-gray-400 font-semibold">
                  <span className="text-amber-400 font-extrabold">{unlockedCount}</span> sur {achievements.length} débloqués
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {achievements.map((a) => (
                <motion.div
                  key={a.id}
                  className={cn('h-3.5 w-3.5 rounded-full', a.unlocked ? 'bg-amber-400 shadow-sm shadow-amber-400/50' : 'bg-gray-600')}
                  animate={a.unlocked ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {achievements.map((ach, i) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.08, ...bounceIn }}
                whileHover={ach.unlocked ? { scale: 1.05, y: -3 } : {}}
                className={cn(
                  'rounded-xl p-4 flex flex-col items-center text-center cursor-default',
                  ach.unlocked
                    ? 'bg-gradient-to-b from-white/15 to-white/5 ring-1 ring-white/20 shadow-lg'
                    : 'bg-white/[0.03] opacity-30'
                )}
              >
                <motion.div
                  className={cn(
                    'h-12 w-12 rounded-xl flex items-center justify-center mb-2',
                    ach.unlocked ? ach.iconBg : 'bg-gray-700'
                  )}
                  animate={ach.unlocked ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                >
                  <ach.icon className={cn('h-6 w-6', ach.unlocked ? ach.iconColor : 'text-gray-500')} />
                </motion.div>
                <p className={cn('text-sm font-extrabold leading-tight', ach.unlocked ? 'text-white' : 'text-gray-500')}>
                  {ach.label}
                </p>
                <p className="text-[11px] text-gray-400 leading-tight mt-1">{ach.description}</p>
                {ach.unlocked && (
                  <motion.div
                    className="mt-2"
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="h-4 w-4 text-amber-400" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── BD DU PROJET + ÉCHANGES CTA ── */}
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">

        {/* BD DU PROJET — visual card */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, ...spring }}
          whileHover={{ scale: 1.01 }}
          className="rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-6 relative overflow-hidden shadow-lg shadow-violet-500/20 flex flex-col justify-between cursor-default"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_60%)]" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_50%)]" />

          <div className="relative">
            <motion.div
              className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/20"
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BookOpen className="h-7 w-7 text-white" />
            </motion.div>
            <h3 className="text-xl font-extrabold text-white tracking-tight mb-1">BD du projet</h3>
            <p className="text-sm text-white/70 font-medium leading-relaxed">
              Une BD générée retraçant la genèse et les moments clés de votre projet
            </p>
          </div>

          <div className="relative mt-4">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-2.5 text-sm font-bold text-white cursor-pointer hover:bg-white/30 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Bientôt disponible
            </motion.div>
          </div>
        </motion.div>

        {/* ÉCHANGES — big CTA */}
        <Link href={`/dashboard/project/${project.id}`} className="block">
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, ...spring }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl bg-gradient-to-br from-pw-500 via-pw-600 to-sky-600 p-6 relative overflow-hidden shadow-lg shadow-pw-500/20 h-full flex flex-col justify-between cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_60%)]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_50%)]" />

            <div className="relative">
              <motion.div
                className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/20"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <MessageSquare className="h-7 w-7 text-white" />
              </motion.div>
              <h3 className="text-xl font-extrabold text-white tracking-tight mb-1">Échanges</h3>
              <p className="text-sm text-white/70 font-medium leading-relaxed">
                {messages.length > 0
                  ? `${messages.length} message${messages.length > 1 ? 's' : ''} dans la conversation`
                  : 'Démarrez la conversation avec votre équipe'}
              </p>
            </div>

            <div className="relative mt-4">
              <motion.div
                whileHover={{ x: 4 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-2.5 text-sm font-bold text-white"
              >
                Accéder aux échanges
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </div>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}

interface Achievement {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  unlocked: boolean;
}

function computeAchievements(
  tasks: Task[],
  sprints: Sprint[],
): Achievement[] {
  const deliveredCount = tasks.filter((t) => t.status === 'livrée').length;
  const allDelivered = tasks.length > 0 && deliveredCount === tasks.length;
  const hasCompletedSprint = sprints.some((s) => s.status === 'terminé');

  return [
    {
      id: 'first-delivery',
      label: 'Première livraison',
      description: 'Un livrable complété',
      icon: Package,
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      unlocked: deliveredCount > 0,
    },
    {
      id: 'sprint-complete',
      label: 'Étape franchie',
      description: 'Une étape clé terminée',
      icon: Flag,
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-400',
      unlocked: hasCompletedSprint,
    },
    {
      id: 'full-delivery',
      label: 'Mission accomplie',
      description: 'Tous les livrables complétés',
      icon: Trophy,
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      unlocked: allDelivered,
    },
  ];
}
