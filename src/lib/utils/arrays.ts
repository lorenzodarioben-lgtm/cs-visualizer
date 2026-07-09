export function cloneArray<T>(items: T[]): T[] {
  return [...items];
}

export function swap<T>(items: T[], a: number, b: number): void {
  const temp = items[a];
  items[a] = items[b];
  items[b] = temp;
}

export function numbersEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

/**
 * Parse a free-form list of numbers separated by commas or whitespace,
 * discarding any tokens that are not finite numbers. Empty input yields [].
 */
export function parseNumberList(raw: string): number[] {
  return raw
    .split(/[\s,]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map(Number)
    .filter((value) => Number.isFinite(value));
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
