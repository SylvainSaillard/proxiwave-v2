'use client';

// Sidebar IdeaStream (desktop) — ≥ md
// Source maquette : stitch_feature_quest/*_desktop/code.html
//
// Structure :
//   - Header : logo "IdeaStream" + sous-titre version
//   - CTA "+ New Idea" (secondary, pill, ombre soft)
//   - Items principaux (sidebarItems)
//   - Footer items (Settings, Support)
//
// Statique pour le MVP lecture seule : le CTA est visuel uniquement,
// il déclenchera la modal CreateIdea dans la phase écriture (hors MVP).

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { NavItem } from './NavItem';
import {
  sidebarItems,
  sidebarFooterItems,
  isNavItemActive,
} from './navigation-items';

export interface SidebarProps {
  /** Sous-titre affiché sous le logo (ex: "v2.4 Innovation Hub"). */
  subtitle?: string;
  /** Label du CTA principal. */
  newIdeaLabel?: string;
  /** Optionnel : classes additionnelles sur le <aside>. */
  className?: string;
}

export function Sidebar({
  subtitle = 'v2.4 Innovation Hub',
  newIdeaLabel = 'New Idea',
  className,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        // Layout
        'hidden md:flex flex-col shrink-0',
        'w-64 lg:w-72 h-screen sticky top-0',
        'bg-surface-container-lowest border-r border-outline-variant',
        'py-6 px-4',
        className,
      )}
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-3 mb-8 group"
        aria-label="IdeaStream — Dashboard"
      >
        <Sparkles
          className="w-6 h-6 text-primary group-hover:text-secondary transition-colors"
          aria-hidden="true"
        />
        <span className="flex flex-col">
          <span className="font-display text-headline-md text-primary">
            IdeaStream
          </span>
          {subtitle ? (
            <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
              {subtitle}
            </span>
          ) : null}
        </span>
      </Link>

      {/* CTA "New Idea" */}
      <button
        type="button"
        className={clsx(
          'flex items-center justify-center gap-2 mb-8 mx-2',
          'px-5 py-3 rounded-full',
          'bg-secondary text-on-secondary',
          'text-label-lg font-semibold',
          'shadow-secondary-glow hover:shadow-soft-lg',
          'transition-shadow active:translate-y-px',
        )}
      >
        <Plus className="w-5 h-5" strokeWidth={2.4} aria-hidden="true" />
        <span>{newIdeaLabel}</span>
      </button>

      {/* Items principaux */}
      <nav aria-label="Primary navigation" className="flex flex-col gap-1">
        {sidebarItems.map((item) => (
          <NavItem
            key={item.id}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={isNavItemActive(item, pathname)}
            variant="sidebar"
          />
        ))}
      </nav>

      {/* Footer (Settings / Support) — colle en bas via mt-auto */}
      <nav
        aria-label="Secondary navigation"
        className="flex flex-col gap-1 mt-auto pt-6 border-t border-outline-variant/60"
      >
        {sidebarFooterItems.map((item) => (
          <NavItem
            key={item.id}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={isNavItemActive(item, pathname)}
            variant="sidebar"
          />
        ))}
      </nav>
    </aside>
  );
}
