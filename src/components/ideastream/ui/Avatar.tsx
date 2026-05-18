// Avatar IdeaStream — supporte image ou initiales avec couleur hex.
//
// Différences avec src/components/ui/Avatar.tsx (legacy) :
//   - Accepte avatarUrl ou (initials + hex color).
//   - Variante isActive avec ring indigo (présence en ligne).
//   - Plus de tailles, alignées sur la grille 8px IdeaStream.

import { clsx } from 'clsx';
import type { IdeaUser } from '@/types/ideastream';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-label-sm',
  md: 'w-10 h-10 text-label-md',
  lg: 'w-12 h-12 text-label-lg',
  xl: 'w-16 h-16 text-body-md',
};

export interface AvatarProps {
  user: Pick<IdeaUser, 'name' | 'initials' | 'avatarUrl' | 'avatarColor' | 'isActive'>;
  size?: AvatarSize;
  /** Si true, ajoute une bordure indigo (présence active). */
  showActiveRing?: boolean;
  /** Couleur de la bordure pour stacks (généralement surface-container-lowest). */
  ringColor?: string;
  className?: string;
}

export function Avatar({
  user,
  size = 'md',
  showActiveRing,
  ringColor,
  className,
}: AvatarProps) {
  const isActive = showActiveRing && user.isActive;

  const baseClasses = clsx(
    'rounded-full flex items-center justify-center font-bold text-white shrink-0 overflow-hidden',
    sizeClasses[size],
    isActive && 'ring-2 ring-primary ring-offset-1',
    ringColor && `ring-2 ${ringColor}`,
    className,
  );

  if (user.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt={user.name}
        className={baseClasses}
      />
    );
  }

  return (
    <div
      className={baseClasses}
      style={{ backgroundColor: user.avatarColor ?? '#3525cd' }}
      aria-label={user.name}
      title={user.name}
    >
      <span aria-hidden="true">{user.initials}</span>
    </div>
  );
}
