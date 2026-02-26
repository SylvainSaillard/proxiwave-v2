// T025 — Composant EmptyState — état vide générique

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-bento bg-warm-50 border border-warm-100 p-12 text-center',
        className
      )}
    >
      <Icon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
      <p className="text-sm font-semibold text-gray-500">{title}</p>
      {description && (
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      )}
    </div>
  );
}
