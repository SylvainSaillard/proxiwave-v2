// T024 — Composant ProgressBar — barre de progression horizontale

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0–100
  trackColor?: string;
  barColor?: string;
  height?: string;
  className?: string;
}

export function ProgressBar({
  value,
  trackColor = 'bg-white/80',
  barColor = 'bg-pw-500',
  height = 'h-2',
  className,
}: ProgressBarProps) {
  return (
    <div className={cn('w-full rounded-full overflow-hidden', height, trackColor, className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-700', barColor)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
