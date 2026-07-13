import { Moon, Sun } from '@phosphor-icons/react';
import type { Theme } from '../../lib/theme/useTheme';

type ThemeToggleProps = {
  theme: Theme;
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="focus-ring group inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300/80 bg-white text-slate-600 transition duration-150 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      <span className="transition-transform duration-300 group-hover:rotate-12 motion-reduce:transition-none motion-reduce:group-hover:rotate-0">
        {isDark ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
      </span>
    </button>
  );
}
