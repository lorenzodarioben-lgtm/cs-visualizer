import { describe, expect, it } from 'vitest';
import { generateSortSteps } from '../algorithms/sortingAlgorithms';
import type { SortAlgorithm } from '../sortingTypes';

const SWAP_BASED: SortAlgorithm[] = ['bubble', 'selection', 'insertion', 'quick'];
const ALL: SortAlgorithm[] = [...SWAP_BASED, 'merge'];

const SAMPLE = [42, 8, 15, 4, 23, 16, 9, 31];

function isPermutationOfRange(ids: number[], length: number): boolean {
  if (ids.length !== length) return false;
  const seen = new Set(ids);
  if (seen.size !== length) return false;
  return ids.every((id) => id >= 0 && id < length);
}

describe('sorting element identity', () => {
  it.each(ALL)('keeps ids a permutation of the positions at every %s step', (algorithm) => {
    const steps = generateSortSteps(algorithm, SAMPLE);
    for (const step of steps) {
      expect(step.ids.length).toBe(step.array.length);
      expect(isPermutationOfRange(step.ids, SAMPLE.length)).toBe(true);
    }
  });

  it.each(SWAP_BASED)('keeps each value attached to its element id in %s', (algorithm) => {
    const steps = generateSortSteps(algorithm, SAMPLE);
    // For swap-based sorts, the value at a position must equal the original
    // value of whichever element id currently occupies that position.
    for (const step of steps) {
      step.array.forEach((value, position) => {
        expect(value).toBe(SAMPLE[step.ids[position]]);
      });
    }
  });

  it('pins ids to positions for the copy-based merge sort', () => {
    const steps = generateSortSteps('merge', SAMPLE);
    const identity = SAMPLE.map((_, index) => index);
    for (const step of steps) {
      expect(step.ids).toEqual(identity);
    }
  });

  it.each(ALL)('ends sorted with matching ids and values for %s', (algorithm) => {
    const steps = generateSortSteps(algorithm, SAMPLE);
    const last = steps.at(-1)!;
    const sortedValues = [...SAMPLE].sort((a, b) => a - b);
    expect(last.array).toEqual(sortedValues);
    expect(isPermutationOfRange(last.ids, SAMPLE.length)).toBe(true);
  });

  it('handles duplicate values without losing identities', () => {
    const withDupes = [5, 1, 5, 1, 5];
    for (const algorithm of ALL) {
      const steps = generateSortSteps(algorithm, withDupes);
      for (const step of steps) {
        expect(isPermutationOfRange(step.ids, withDupes.length)).toBe(true);
      }
    }
  });
});
