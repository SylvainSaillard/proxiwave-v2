// RelativeTime — affiche un timestamp en format relatif ("2h ago",
// "5 days ago"). Server Component pur.
//
// Pour le MVP, calcul simple par segments (60s, 60m, 24h, 7d, 30d).
// Plus tard : Intl.RelativeTimeFormat avec locale du user.

import { clsx } from 'clsx';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

function formatRelative(date: Date, now: Date = new Date()): string {
  const diff = now.getTime() - date.getTime();
  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) {
    const m = Math.floor(diff / MINUTE);
    return `${m} ${m === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diff < DAY) {
    const h = Math.floor(diff / HOUR);
    return `${h} ${h === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diff < WEEK) {
    const d = Math.floor(diff / DAY);
    return `${d} ${d === 1 ? 'day' : 'days'} ago`;
  }
  if (diff < MONTH) {
    const w = Math.floor(diff / WEEK);
    return `${w} ${w === 1 ? 'week' : 'weeks'} ago`;
  }
  // Au-delà : date absolue courte (ex: "Apr 22")
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export interface RelativeTimeProps {
  /** ISO datetime ou objet Date. */
  date: string | Date;
  className?: string;
}

export function RelativeTime({ date, className }: RelativeTimeProps) {
  const parsed = typeof date === 'string' ? new Date(date) : date;
  const label = formatRelative(parsed);

  return (
    <time dateTime={parsed.toISOString()} className={clsx('tabular-nums', className)}>
      {label}
    </time>
  );
}
