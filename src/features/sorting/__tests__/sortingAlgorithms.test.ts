import { describe, expect, it } from 'vitest';
import { finalArrayFromSortSteps, generateSortSteps } from '../algorithms/sortingAlgorithms';
import type { SortAlgorithm } from '../sortingTypes';

const algorithms: SortAlgorithm[] = ['bubble', 'selection', 'insertion', 'merge', 'quick'];

function sorted(values: number[]) {
  return [...values].sort((a, b) => a - b);
}

describe('sorting step generators', () => {
  it.each(algorithms)('%s sort sorts correctly', (algorithm) => {
    const input = [9, 3, 5, 1, 8, 4];
    const steps = generateSortSteps(algorithm, input);
    expect(finalArrayFromSortSteps(steps)).toEqual(sorted(input));
  });

  it.each(algorithms)('%s handles empty arrays', (algorithm) => {
    expect(finalArrayFromSortSteps(generateSortSteps(algorithm, []))).toEqual([]);
  });

  it.each(algorithms)('%s handles one-item arrays', (algorithm) => {
    expect(finalArrayFromSortSteps(generateSortSteps(algorithm, [7]))).toEqual([7]);
  });

  it.each(algorithms)('%s handles duplicates', (algorithm) => {
    const input = [4, 2, 4, 1, 2];
    expect(finalArrayFromSortSteps(generateSortSteps(algorithm, input))).toEqual([1, 2, 2, 4, 4]);
  });

  it.each(algorithms)('%s handles negative numbers', (algorithm) => {
    const input = [0, -3, 8, -1, 5];
    expect(finalArrayFromSortSteps(generateSortSteps(algorithm, input))).toEqual([-3, -1, 0, 5, 8]);
  });
});
