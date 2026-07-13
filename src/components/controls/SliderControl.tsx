type SliderControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
};

export function SliderControl({ label, value, min, max, step = 1, suffix = '', onChange }: SliderControlProps) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="control-label flex items-center justify-between gap-2">
        <span className="min-w-0 truncate">{label}</span>
        <span className="shrink-0 rounded border border-slate-200/70 bg-white px-1.5 py-0.5 font-mono text-[0.68rem] tabular-nums text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {value}
          {suffix}
        </span>
      </span>
      <input
        className="focus-ring h-1.5 w-full min-w-0 cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
