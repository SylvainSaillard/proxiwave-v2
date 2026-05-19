// SearchInput — champ de recherche pill, icone loupe a gauche.
//
// Variants :
//   - 'inline' : compact, taille moyenne (header desktop, TopAppBar)
//   - 'block'  : pleine largeur, plus prominent (Idea Wall mobile)
//
// Client Component si on cable un onChange ; sinon Server. Pour MVP
// lecture, il peut etre passif (placeholder seulement).

'use client';

import { Search, X } from 'lucide-react';
import { clsx } from 'clsx';

export interface SearchInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  variant?: 'inline' | 'block';
  className?: string;
}

export function SearchInput({
  value,
  defaultValue,
  placeholder = 'Search…',
  onChange,
  onClear,
  variant = 'block',
  className,
}: SearchInputProps) {
  const isControlled = value !== undefined;
  const showClear = (isControlled ? value : defaultValue)?.length;

  return (
    <div
      className={clsx(
        'relative w-full',
        variant === 'inline' && 'max-w-md',
        className,
      )}
    >
      <Search
        className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className={clsx(
          'w-full pl-11 pr-10 py-3 rounded-full',
          'bg-surface-container-low text-body-md text-on-surface',
          'placeholder:text-on-surface-variant',
          'border border-transparent',
          'focus:border-primary focus:bg-surface-container-lowest focus:outline-none',
          'transition-colors',
        )}
      />
      {showClear && onClear ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className={clsx(
            'absolute right-3 top-1/2 -translate-y-1/2',
            'w-7 h-7 flex items-center justify-center rounded-full',
            'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
            'transition-colors',
          )}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
