import type { ReactNode } from 'react';
import type { VisualizerKey } from '../../App';
import type { Theme } from '../../lib/theme/useTheme';
import { ThemeToggle } from './ThemeToggle';

type NavItem = { key: VisualizerKey; label: string; description: string; icon: ReactNode };

const navItems: NavItem[] = [
  {
    key: 'sorting',
    label: 'Sorting',
    description: 'Bubble, selection, insertion, merge, quick',
    icon: <NavGlyph d="M4 18V8M9 18v-6M14 18V4M19 18v-9" />,
  },
  {
    key: 'graph',
    label: 'Graph',
    description: 'BFS and DFS traversal',
    icon: (
      <NavGlyph>
        <circle cx="6" cy="6" r="2.4" />
        <circle cx="18" cy="7" r="2.4" />
        <circle cx="12" cy="18" r="2.4" />
        <path d="M7.6 7.6 10.7 16M16.6 8.8 13.3 16M8 6.4h8" fill="none" />
      </NavGlyph>
    ),
  },
  {
    key: 'heap',
    label: 'Heap',
    description: 'Min-heap operations',
    icon: (
      <NavGlyph>
        <circle cx="12" cy="5" r="2.2" />
        <circle cx="6" cy="14" r="2.2" />
        <circle cx="18" cy="14" r="2.2" />
        <path d="M10.4 6.4 7.4 12.4M13.6 6.4l3 6" fill="none" />
      </NavGlyph>
    ),
  },
  {
    key: 'linked-list',
    label: 'Linked List',
    description: 'Pointers and node operations',
    icon: (
      <NavGlyph>
        <rect x="3" y="9" width="6" height="6" rx="1.5" />
        <rect x="15" y="9" width="6" height="6" rx="1.5" />
        <path d="M9 12h6M13 10l2 2-2 2" fill="none" />
      </NavGlyph>
    ),
  },
  {
    key: 'state-machine',
    label: 'State Machine',
    description: 'Turnstile finite automaton',
    icon: (
      <NavGlyph>
        <circle cx="7" cy="12" r="3" />
        <circle cx="17" cy="12" r="3" />
        <path d="M10 11c2-2 2-2 4 0M14 13c-2 2-2 2-4 0" fill="none" />
      </NavGlyph>
    ),
  },
];

type AppShellProps = {
  active: VisualizerKey;
  onChange: (key: VisualizerKey) => void;
  theme: Theme;
  onToggleTheme: () => void;
  children: ReactNode;
};

export function AppShell({ active, onChange, theme, onToggleTheme, children }: AppShellProps) {
  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="panel relative mb-6 overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <BrandMark />
                <div>
                  <p className="control-label">Portfolio project</p>
                  <h1 className="text-3xl font-black leading-none tracking-tight heading-strong sm:text-4xl">
                    CS Visualizer
                  </h1>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-body sm:text-base">
                An interactive playground for data structures and algorithms. Watch real state
                transitions unfold step by step, with deterministic playback, live explanations,
                and pseudocode you can follow along.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <StatChip value="5" label="visualizers" />
                <StatChip value="9+" label="algorithms" />
                <StatChip value="TypeScript" label="fully typed" />
                <StatChip value="tested" label="pure logic" />
              </div>
            </div>
            <div className="flex items-center gap-2 md:flex-col md:items-end">
              <a
                href="https://github.com/lorenzodarioben-lgtm/cs-visualizer"
                target="_blank"
                rel="noreferrer noopener"
                className="focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-700/60 dark:hover:text-white"
              >
                <GithubIcon />
                <span>View source</span>
              </a>
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
          <nav className="panel h-fit p-3 lg:sticky lg:top-5" aria-label="Visualizers">
            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Visualizers</p>
            <div className="grid gap-2">
              {navItems.map((item) => {
                const isActive = active === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => onChange(item.key)}
                    className={`focus-ring group flex items-start gap-3 rounded-2xl border p-3 text-left transition ${
                      isActive
                        ? 'border-indigo-500/40 bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-100 dark:text-slate-300 dark:hover:border-white/10 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-indigo-600 group-hover:bg-white dark:bg-slate-800 dark:text-indigo-300 dark:group-hover:bg-slate-700'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold">{item.label}</span>
                      <span
                        className={`mt-0.5 block text-xs leading-4 ${
                          isActive ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
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

          <main key={active} className="animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function NavGlyph({ d, children }: { d?: string; children?: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {d ? <path d={d} /> : children}
    </svg>
  );
}

function BrandMark() {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-glow">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 18V8M9 18v-6M14 18V5M19 18v-9" />
      </svg>
    </span>
  );
}

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-full border border-slate-200 bg-white/60 px-3 py-1 text-xs dark:border-white/10 dark:bg-slate-800/50">
      <span className="font-bold text-indigo-600 dark:text-indigo-400">{value}</span>
      <span className="font-medium text-slate-500 dark:text-slate-400">{label}</span>
    </span>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}
