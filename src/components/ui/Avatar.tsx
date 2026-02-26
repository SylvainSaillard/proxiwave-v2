// T024 — Composant Avatar — initiales + couleur de fond

import { cn } from '@/lib/utils';

interface AvatarProps {
  initials: string;
  color: string; // ex: 'bg-pw-500', 'bg-sky-400'
  size?: 'xs' | 'sm' | 'md' | 'lg';
  borderColor?: string; // pour les avatars groupés (-space-x-2)
  className?: string;
}

const sizeMap = {
  xs: 'h-6 w-6 text-[8px]',
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-9 w-9 text-[10px]',
  lg: 'h-10 w-10 text-sm',
};

export function Avatar({ initials, color, size = 'md', borderColor, className }: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white shrink-0',
        sizeMap[size],
        color,
        borderColor && `border-2 ${borderColor}`,
        className
      )}
    >
      {initials}
    </div>
  );
}
