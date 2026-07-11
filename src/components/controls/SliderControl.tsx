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
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[0.68rem] tabular-nums text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {value}
          {suffix}
        </span>
      </span>
      <input
        className="focus-ring w-full min-w-0 accent-indigo-600"
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
