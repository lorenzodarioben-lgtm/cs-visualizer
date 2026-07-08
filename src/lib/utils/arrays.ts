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
