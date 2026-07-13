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
        className="flex min-w-0 gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800"
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
              className={`focus-ring flex-1 rounded-lg px-2 py-1.5 text-xs font-bold capitalize transition duration-150 active:scale-[0.97] ${
                selected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
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
