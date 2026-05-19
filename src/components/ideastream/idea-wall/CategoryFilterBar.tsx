// CategoryFilterBar — pills horizontales scrollables pour filtrer
// l'Idea Wall par categorie.
//
// Pill "All Categories" inclut un id null. Active = bg primary-fixed
// + text on-primary-fixed-variant. Inactive = bg surface-container-low
// + text on-surface-variant.

'use client';

import { clsx } from 'clsx';
import type { IdeaCategory } from '@/types/ideastream';

export interface CategoryFilterBarProps {
  categories: IdeaCategory[];
  /** id de la categorie active (null = "All Categories"). */
  activeId: string | null;
  onChange: (id: string | null) => void;
  className?: string;
}

export function CategoryFilterBar({
  categories,
  activeId,
  onChange,
  className,
}: CategoryFilterBarProps) {
  return (
    <div
      className={clsx(
        'flex items-center gap-2 overflow-x-auto -mx-4 px-4',
        '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
      role="tablist"
      aria-label="Filter ideas by category"
    >
      <CategoryPill
        label="All Categories"
        isActive={activeId === null}
        onClick={() => onChange(null)}
      />
      {categories.map((category) => (
        <CategoryPill
          key={category.id}
          label={category.label}
          isActive={activeId === category.id}
          onClick={() => onChange(category.id)}
        />
      ))}
    </div>
  );
}

interface CategoryPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function CategoryPill({ label, isActive, onClick }: CategoryPillProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={clsx(
        'shrink-0 px-4 py-2 rounded-full text-label-md font-semibold',
        'transition-colors',
        isActive
          ? 'bg-primary text-on-primary shadow-soft'
          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
      )}
    >
      {label}
    </button>
  );
}
