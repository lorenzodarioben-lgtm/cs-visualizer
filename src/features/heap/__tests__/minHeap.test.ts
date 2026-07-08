import { describe, expect, it } from 'vitest';
import { finalHeapFromSteps, heapExtractMinSteps, heapInsertSteps, heapPeekSteps, heapifySteps, isValidMinHeap } from '../algorithms/minHeap';

describe('min heap operations', () => {
  it('insert maintains heap property', () => {
    const heap = finalHeapFromSteps(heapifySteps([5, 12, 9]));
    const inserted = finalHeapFromSteps(heapInsertSteps(heap, 1));
    expect(isValidMinHeap(inserted)).toBe(true);
    expect(inserted[0]).toBe(1);
  });

  it('extract returns correct root value', () => {
    const heap = finalHeapFromSteps(heapifySteps([8, 3, 7, 1, 9]));
    const steps = heapExtractMinSteps(heap);
    expect(steps.at(-1)?.result).toBe(1);
    expect(isValidMinHeap(finalHeapFromSteps(steps))).toBe(true);
  });

  it('heapify creates a valid heap', () => {
    const heap = finalHeapFromSteps(heapifySteps([10, 4, 15, 1, 20, 3]));
    expect(isValidMinHeap(heap)).toBe(true);
    expect(heap[0]).toBe(1);
  });

  it('peek returns correct root without mutating heap', () => {
    const heap = finalHeapFromSteps(heapifySteps([9, 2, 6]));
    const before = [...heap];
    const steps = heapPeekSteps(heap);
    expect(steps[0].result).toBe(2);
    expect(heap).toEqual(before);
  });

  it('operations handle empty heap gracefully', () => {
    expect(heapExtractMinSteps([])[0].action).toBe('empty');
    expect(heapPeekSteps([])[0].action).toBe('empty');
    expect(finalHeapFromSteps(heapInsertSteps([], 10))).toEqual([10]);
  });
});
