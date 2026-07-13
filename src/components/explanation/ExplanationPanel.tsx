import type { ReactNode } from 'react';

export type ExplanationContent = {
  title: string;
  currentStep: string;
  concept: string;
  timeComplexity: string;
  spaceComplexity: string;
  useCases: string[];
  edgeCases: string[];
};

type ExplanationPanelProps = {
  content: ExplanationContent;
  children?: ReactNode;
};

export function ExplanationPanel({ content, children }: ExplanationPanelProps) {
  return (
    <aside className="panel grid gap-4 p-4 sm:p-5">
      <div className="border-b border-slate-200/70 pb-3 dark:border-slate-800">
        <p className="control-label">Explanation</p>
        <h2 className="mt-1.5 text-lg font-bold heading-strong">{content.title}</h2>
      </div>

      <div
        aria-live="polite"
        className="rounded-lg border-l-2 border-indigo-500 bg-indigo-50/70 px-3.5 py-3 dark:bg-indigo-500/10"
      >
        <p className="control-label text-indigo-600 dark:text-indigo-300">Current step</p>
        <p className="mt-1.5 text-sm leading-6 text-indigo-950 dark:text-indigo-50">{content.currentStep}</p>
      </div>

      <div>
        <p className="control-label">Concept</p>
        <p className="mt-1.5 text-sm leading-6 text-body">{content.concept}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <ComplexityTile label="Time" value={content.timeComplexity} />
        <ComplexityTile label="Space" value={content.spaceComplexity} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <InfoList title="Use cases" items={content.useCases} />
        <InfoList title="Edge cases" items={content.edgeCases} />
      </div>
      {children}
    </aside>
  );
}

function ComplexityTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="viz-card p-3">
      <p className="control-label">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="control-label">{title}</p>
      <ul className="mt-2 space-y-1.5 text-sm leading-5 text-body">
        {items.map((item) => (
          <li className="flex gap-2.5" key={item}>
            <span aria-hidden="true" className="mt-[0.4rem] h-1 w-1 shrink-0 rounded-full bg-indigo-400 dark:bg-indigo-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
