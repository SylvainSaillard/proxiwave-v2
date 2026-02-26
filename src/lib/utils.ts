// T023 — Utilitaires partagés

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes sans conflit */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Formate une date ISO en français ou anglais */
export function formatDate(
  date: string | null | undefined,
  locale: string = 'fr',
): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Formate une taille de fichier en Ko/Mo */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/** Génère les initiales depuis un nom complet */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Couleur de badge selon le statut */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    en_cours: 'bg-pw-100 text-pw-700',
    terminé: 'bg-green-100 text-green-700',
    à_venir: 'bg-warm-200 text-warm-400',
    actif: 'bg-pw-100 text-pw-700',
    nouvelle: 'bg-sky-100 text-sky-300',
    en_revue: 'bg-amber-100 text-amber-700',
    acceptée: 'bg-green-100 text-green-700',
    refusée: 'bg-red-100 text-red-600',
    haute: 'bg-red-100 text-red-600',
    moyenne: 'bg-amber-100 text-amber-700',
    basse: 'bg-green-100 text-green-700',
  };
  return map[status] ?? 'bg-warm-100 text-warm-400';
}
