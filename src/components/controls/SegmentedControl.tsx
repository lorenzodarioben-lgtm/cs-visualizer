export type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  label?: string;
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  ariaLabel?: string;
};

/** A compact set of mutually-exclusive pill buttons (radio-group semantics). */
export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div className="grid min-w-0 gap-2">
      {label ? <span className="control-label truncate">{label}</span> : null}
      <div
        role="radiogroup"
        aria-label={ariaLabel ?? label}
        className="flex min-w-0 gap-0.5 rounded-lg border border-slate-300/70 bg-slate-100/80 p-0.5 dark:border-slate-700 dark:bg-slate-800/60"
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={`focus-ring flex-1 rounded-[0.3rem] px-2 py-1.5 text-xs font-bold capitalize transition duration-150 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 ${
                selected
                  ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:text-indigo-300 dark:ring-slate-700'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
