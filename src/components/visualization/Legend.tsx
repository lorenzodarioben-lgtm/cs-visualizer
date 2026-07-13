type LegendItem = {
  label: string;
  className: string;
};

type LegendProps = {
  items: LegendItem[];
};

export function Legend({ items }: LegendProps) {
  return (
    <ul className="flex flex-wrap gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
      {items.map((item) => (
        <li className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm dark:bg-slate-800" key={item.label}>
          <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ring-1 ring-black/5 dark:ring-white/10 ${item.className}`} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
