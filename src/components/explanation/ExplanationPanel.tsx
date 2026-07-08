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
    <aside className="panel grid gap-4 p-5">
      <div>
        <p className="control-label">Explanation</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">{content.title}</h2>
      </div>
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
        <p className="text-sm font-semibold text-indigo-950">Current step</p>
        <p className="mt-1 text-sm leading-6 text-indigo-900">{content.currentStep}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">Concept</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{content.concept}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-100 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Time</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{content.timeComplexity}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Space</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{content.spaceComplexity}</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <InfoList title="Use cases" items={content.useCases} />
        <InfoList title="Edge cases" items={content.edgeCases} />
      </div>
      {children}
    </aside>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <ul className="mt-2 space-y-1 text-sm leading-5 text-slate-600">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
