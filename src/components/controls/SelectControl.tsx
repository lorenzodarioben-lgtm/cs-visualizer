export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type SelectControlProps<T extends string> = {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
};

/** Labelled dropdown wired to the shared control-input styling. */
export function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectControlProps<T>) {
  return (
    <label className="grid gap-2">
      <span className="control-label">{label}</span>
      <select
        className="control-input"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
