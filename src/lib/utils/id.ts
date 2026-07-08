let counter = 0;

export function nextStepId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

export function resetStepIdCounter(): void {
  counter = 0;
}
