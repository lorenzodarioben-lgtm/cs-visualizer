type PseudocodePanelProps = {
  lines: string[];
  activeLine?: number;
};

export function PseudocodePanel({ lines, activeLine }: PseudocodePanelProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-sm text-slate-200 shadow-stage">
      <div className="flex items-center gap-1.5 border-b border-slate-800/80 bg-slate-900/60 px-3.5 py-2">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-slate-600" />
        <p className="control-label text-slate-400">Pseudocode</p>
      </div>
      <ol className="space-y-0.5 p-2.5 font-mono text-xs leading-5">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = activeLine === lineNumber;
          return (
            <li
              aria-current={isActive ? 'step' : undefined}
              className={`grid grid-cols-[1.75rem_1fr] rounded-md border-l-2 py-1 pr-2 transition-colors ${
                isActive ? 'border-indigo-400 bg-indigo-500/20 text-white' : 'border-transparent text-slate-300'
              }`}
              key={`${line}-${lineNumber}`}
            >
              <span className="select-none pl-2 text-slate-600">{lineNumber}</span>
              <code>{line}</code>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
