import { useReducedMotion } from '../../lib/animation/useReducedMotion';

export type StatusTone = 'neutral' | 'compare' | 'swap' | 'pivot' | 'active' | 'visit' | 'done';

const tones: Record<StatusTone, { dot: string; box: string }> = {
  neutral: {
    dot: 'bg-slate-400',
    box: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  },
  compare: {
    dot: 'bg-amber-400',
    box: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  },
  swap: {
    dot: 'bg-rose-500',
    box: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  },
  pivot: {
    dot: 'bg-violet-500',
    box: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  },
  active: {
    dot: 'bg-sky-500',
    box: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  },
  visit: {
    dot: 'bg-indigo-500',
    box: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  },
  done: {
    dot: 'bg-emerald-500',
    box: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  },
};

type StatusBadgeProps = {
  tone: StatusTone;
  label: string;
};

export function StatusBadge({ tone, label }: StatusBadgeProps) {
  const styles = tones[tone];
  const reducedMotion = useReducedMotion();
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${styles.box}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${styles.dot} ${reducedMotion ? '' : 'animate-pop'}`}
        key={reducedMotion ? undefined : label}
      />
      {label}
    </span>
  );
}
