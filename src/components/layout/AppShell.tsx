import type { ReactNode } from 'react';
import type { VisualizerKey } from '../../App';

const navItems: { key: VisualizerKey; label: string; description: string }[] = [
  { key: 'sorting', label: 'Sorting', description: 'Bubble, selection, insertion, merge, quick' },
  { key: 'graph', label: 'Graph', description: 'BFS and DFS traversal' },
  { key: 'heap', label: 'Heap', description: 'Min-heap operations' },
  { key: 'linked-list', label: 'Linked List', description: 'Pointers and node operations' },
  { key: 'state-machine', label: 'State Machine', description: 'Turnstile finite automaton' },
];

type AppShellProps = {
  active: VisualizerKey;
  onChange: (key: VisualizerKey) => void;
  children: ReactNode;
};

export function AppShell({ active, onChange, children }: AppShellProps) {
  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-soft backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="control-label">Portfolio project</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              CS Visualizer
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Interactive algorithm and data-structure visualizations with deterministic step generation, educational explanations, and tests.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white shadow-lg">
            <span className="font-semibold">Mode:</span> learn by stepping through state
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
          <nav className="panel h-fit p-3 lg:sticky lg:top-5">
            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Visualizers</p>
            <div className="grid gap-2">
              {navItems.map((item) => (
                <button
                  className={`focus-ring rounded-2xl p-3 text-left transition ${
                    active === item.key
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  key={item.key}
                  onClick={() => onChange(item.key)}
                >
                  <span className="block text-sm font-bold">{item.label}</span>
                  <span className={`mt-1 block text-xs ${active === item.key ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {item.description}
                  </span>
                </button>
              ))}
            </div>
          </nav>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
