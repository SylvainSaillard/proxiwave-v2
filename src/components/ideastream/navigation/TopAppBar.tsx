// TopAppBar IdeaStream (desktop) — ≥ md
// Header de page persistant : compte XP/points, search globale, cloche,
// avatar utilisateur. Sticky en haut, fond surface-container-lowest.
//
// Server Component par défaut. Les sous-éléments interactifs (search,
// notifications) sont des Client Components encapsulés.

import { Search, Bell } from 'lucide-react';
import { clsx } from 'clsx';

export interface TopAppBarProps {
  /** Affichage du compteur points/XP à droite (ex: "246 Global Points"). */
  pointsLabel?: string;
  /** Initiales ou avatar URL de l'utilisateur. */
  userInitials?: string;
  /** Placeholder du champ de recherche. */
  searchPlaceholder?: string;
  className?: string;
}

export function TopAppBar({
  pointsLabel = '246 Global Points',
  userInitials = '?',
  searchPlaceholder = 'Search feature requests…',
  className,
}: TopAppBarProps) {
  return (
    <header
      className={clsx(
        'hidden md:flex items-center gap-4 sticky top-0 z-30',
        'h-16 px-6 lg:px-8',
        'bg-surface-container-lowest/95 backdrop-blur',
        'border-b border-outline-variant',
        className,
      )}
    >
      {/* Points / XP — compteur global */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed">
        <span
          className="w-2 h-2 rounded-full bg-primary"
          aria-hidden="true"
        />
        <span className="text-label-md font-semibold text-on-primary-fixed-variant">
          {pointsLabel}
        </span>
      </div>

      {/* Search globale — au centre, flex-1 */}
      <div className="flex-1 max-w-xl relative">
        <Search
          className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder={searchPlaceholder}
          className={clsx(
            'w-full pl-11 pr-4 py-2.5 rounded-full',
            'bg-surface-container-low text-body-sm text-on-surface',
            'placeholder:text-on-surface-variant',
            'border border-transparent',
            'focus:border-primary focus:bg-surface-container-lowest focus:outline-none',
            'transition-colors',
          )}
        />
      </div>

      {/* Notifications */}
      <button
        type="button"
        aria-label="Notifications"
        className={clsx(
          'relative w-10 h-10 flex items-center justify-center rounded-full',
          'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
          'transition-colors',
        )}
      >
        <Bell className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
        {/* Dot d'alerte (placeholder, branché plus tard sur la presence) */}
        <span
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary"
          aria-hidden="true"
        />
      </button>

      {/* Avatar utilisateur */}
      <button
        type="button"
        aria-label="User menu"
        className={clsx(
          'w-10 h-10 flex items-center justify-center rounded-full',
          'bg-secondary text-on-secondary text-label-md font-semibold',
          'shadow-soft hover:shadow-soft-md transition-shadow',
        )}
      >
        {userInitials}
      </button>
    </header>
  );
}
