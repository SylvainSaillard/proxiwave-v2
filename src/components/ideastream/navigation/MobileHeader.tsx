// MobileHeader IdeaStream — < md
// Header compact mobile : avatar (ou back arrow) + logo + cloche.
// Optionnellement un chip XP cliquable (Dashboard) ou rien (Idea Wall).
//
// Server Component par défaut. Si l'utilisateur veut une variante avec
// back arrow (ex: Idea Detail), passer `backHref`.

import Link from 'next/link';
import { ArrowLeft, Bell, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export interface MobileHeaderProps {
  /** Si présent, remplace l'avatar par un bouton back. */
  backHref?: string;
  /** Initiales ou avatar URL de l'utilisateur. */
  userInitials?: string;
  /** Chip XP optionnel à droite du logo (ex: "2,450 Points"). */
  xpLabel?: string;
  /** Personnalisation classe. */
  className?: string;
}

export function MobileHeader({
  backHref,
  userInitials = '?',
  xpLabel,
  className,
}: MobileHeaderProps) {
  return (
    <header
      className={clsx(
        'md:hidden flex items-center gap-3 sticky top-0 z-30',
        'h-14 px-4',
        'bg-surface-container-lowest/95 backdrop-blur',
        'border-b border-outline-variant',
        className,
      )}
    >
      {/* Avatar OU back arrow à gauche */}
      {backHref ? (
        <Link
          href={backHref}
          aria-label="Back"
          className={clsx(
            'w-10 h-10 flex items-center justify-center rounded-full',
            'text-on-surface hover:bg-surface-container-low transition-colors',
          )}
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </Link>
      ) : (
        <button
          type="button"
          aria-label="User menu"
          className={clsx(
            'w-9 h-9 flex items-center justify-center rounded-full',
            'bg-secondary text-on-secondary text-label-md font-semibold',
            'shadow-soft',
          )}
        >
          {userInitials}
        </button>
      )}

      {/* Logo IdeaStream — centré gauche */}
      <Link
        href="/dashboard"
        className="flex items-center gap-1.5 flex-1"
        aria-label="IdeaStream — Dashboard"
      >
        <Sparkles
          className="w-5 h-5 text-primary"
          strokeWidth={2.2}
          aria-hidden="true"
        />
        <span className="font-display text-headline-md text-primary">
          IdeaStream
        </span>
      </Link>

      {/* Chip XP optionnel + cloche */}
      <div className="flex items-center gap-2">
        {xpLabel ? (
          <Link
            href="/profile"
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1 rounded-full',
              'bg-primary-fixed text-on-primary-fixed-variant',
              'text-label-sm font-semibold',
              'shadow-soft hover:shadow-soft-md transition-shadow',
            )}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-primary"
              aria-hidden="true"
            />
            {xpLabel}
          </Link>
        ) : null}

        <button
          type="button"
          aria-label="Notifications"
          className={clsx(
            'relative w-9 h-9 flex items-center justify-center rounded-full',
            'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
            'transition-colors',
          )}
        >
          <Bell className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary"
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
}
