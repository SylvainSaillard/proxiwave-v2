// AvatarGroup — empile plusieurs Avatars avec overlap.
//
// Style stitch : `-space-x-2`, dernier avatar de la stack remplacé par
// un compteur "+N" sur fond primary si la liste dépasse `max`.

import { clsx } from 'clsx';
import type { IdeaUser } from '@/types/ideastream';
import { Avatar, type AvatarSize } from './Avatar';

export interface AvatarGroupProps {
  users: IdeaUser[];
  /** Nombre max d'avatars affichés avant le compteur "+N". */
  max?: number;
  size?: AvatarSize;
  className?: string;
}

const overflowSize: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-label-sm',
  md: 'w-10 h-10 text-label-md',
  lg: 'w-12 h-12 text-label-lg',
  xl: 'w-16 h-16 text-body-md',
};

export function AvatarGroup({
  users,
  max = 3,
  size = 'sm',
  className,
}: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const overflow = users.length - visible.length;

  return (
    <div className={clsx('flex items-center -space-x-2', className)}>
      {visible.map((user) => (
        <Avatar
          key={user.id}
          user={user}
          size={size}
          className="ring-2 ring-surface-container-lowest"
        />
      ))}
      {overflow > 0 ? (
        <div
          className={clsx(
            'rounded-full flex items-center justify-center font-bold text-white',
            'bg-primary ring-2 ring-surface-container-lowest',
            overflowSize[size],
          )}
          aria-label={`+${overflow} others`}
          title={`+${overflow} others`}
        >
          <span aria-hidden="true">+{overflow}</span>
        </div>
      ) : null}
    </div>
  );
}
