type PseudocodePanelProps = {
  lines: string[];
  activeLine?: number;
};

export function PseudocodePanel({ lines, activeLine }: PseudocodePanelProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200 shadow-inner">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Pseudocode</p>
      <ol className="space-y-1 font-mono text-xs leading-5">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = activeLine === lineNumber;
          return (
            <li
              aria-current={isActive ? 'step' : undefined}
              className={`grid grid-cols-[2rem_1fr] rounded-lg border-l-2 px-2 py-1 transition-colors ${
                isActive ? 'border-indigo-400 bg-indigo-500/25 text-white' : 'border-transparent text-slate-300'
              }`}
              key={`${line}-${lineNumber}`}
            >
              <span className="select-none text-slate-500">{lineNumber}</span>
              <code>{line}</code>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
