type LegendItem = {
  label: string;
  className: string;
};

type LegendProps = {
  items: LegendItem[];
};

export function Legend({ items }: LegendProps) {
  return (
    <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
      {items.map((item) => (
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm dark:bg-slate-800" key={item.label}>
          <span className={`h-2.5 w-2.5 rounded-full ${item.className}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
