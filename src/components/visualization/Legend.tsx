type LegendItem = {
  label: string;
  className: string;
};

type LegendProps = {
  items: LegendItem[];
};

export function Legend({ items }: LegendProps) {
  return (
    <ul className="flex flex-wrap gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
      {items.map((item) => (
        <li
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/70 bg-white/70 px-2 py-1 dark:border-slate-800 dark:bg-slate-800/50"
          key={item.label}
        >
          <span aria-hidden="true" className={`h-2 w-2 rounded-[3px] ring-1 ring-black/5 dark:ring-white/10 ${item.className}`} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
