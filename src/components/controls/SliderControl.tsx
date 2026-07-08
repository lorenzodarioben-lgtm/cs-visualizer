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
    <label className="grid gap-2">
      <span className="control-label flex items-center justify-between gap-3">
        {label}
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.68rem] text-slate-700">
          {value}{suffix}
        </span>
      </span>
      <input
        className="focus-ring w-full accent-indigo-600"
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
