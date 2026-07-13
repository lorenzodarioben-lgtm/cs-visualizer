import type { ReactNode } from 'react';
import type { Theme } from '../../lib/theme/useTheme';
import { VISUALIZERS, type VisualizerKey } from '../../features/visualizers';
import { ThemeToggle } from './ThemeToggle';

type AppShellProps = {
  active: VisualizerKey;
  onChange: (key: VisualizerKey) => void;
  theme: Theme;
  onToggleTheme: () => void;
  children: ReactNode;
};

export function AppShell({ active, onChange, theme, onToggleTheme, children }: AppShellProps) {
  return (
    <div className="min-h-[100dvh] px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="panel mb-4 flex flex-col gap-4 rounded-2xl px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3.5">
            <BrandMark />
            <div className="min-w-0">
              <h1 className="text-xl font-bold leading-tight heading-strong sm:text-[1.7rem]">CS Visualizer</h1>
              <p className="control-label mt-0.5">Data structures and algorithms, visualized</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="hidden items-center gap-5 md:flex">
              <Meta value="6" label="visualizers" />
              <Meta value="12+" label="algorithms" />
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/lorenzodarioben-lgtm/cs-visualizer"
                target="_blank"
                rel="noreferrer noopener"
                className="focus-ring inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300/80 bg-white px-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
              >
                <GithubIcon />
                <span className="hidden sm:inline">Source</span>
              </a>
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[16.5rem_1fr]">
          <nav className="panel h-fit p-2.5 lg:sticky lg:top-4" aria-labelledby="visualizer-nav-heading">
            <p id="visualizer-nav-heading" className="control-label mb-2.5 px-2.5">
              Visualizers
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {VISUALIZERS.map((item) => {
                const isActive = active === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => onChange(item.key)}
                    className={`focus-ring group relative flex items-center gap-3 overflow-hidden rounded-lg px-2.5 py-2 text-left transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-950 dark:bg-indigo-500/10 dark:text-white'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-1.5 left-0 w-1 rounded-full bg-indigo-500 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:text-indigo-300'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold leading-tight">{item.label}</span>
                      <span
                        className={`mt-0.5 hidden text-xs leading-4 sm:block ${
                          isActive ? 'text-indigo-700/80 dark:text-indigo-200/70' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {item.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          <main key={active}>{children}</main>
        </div>
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-glow">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 18V9M9 18v-6M14 18V5M19 18v-9" />
      </svg>
    </span>
  );
}

function Meta({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-lg font-bold leading-none tabular-nums text-slate-900 dark:text-white">{value}</div>
      <div className="control-label mt-1">{label}</div>
    </div>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}
