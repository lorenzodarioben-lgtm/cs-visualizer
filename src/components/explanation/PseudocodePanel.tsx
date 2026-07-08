type PseudocodePanelProps = {
  lines: string[];
  activeLine?: number;
};

export function PseudocodePanel({ lines, activeLine }: PseudocodePanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-200">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Pseudocode</p>
      <ol className="space-y-1 font-mono text-xs leading-5">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          return (
            <li
              className={`grid grid-cols-[2rem_1fr] rounded-lg px-2 py-1 ${
                activeLine === lineNumber ? 'bg-indigo-500/30 text-white' : 'text-slate-300'
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
