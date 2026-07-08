import { describe, expect, it } from 'vitest';
import { deleteAtIndexSteps, deleteByValueSteps, finalListFromSteps, insertAtIndexSteps, insertHeadSteps, insertTailSteps, reverseSteps, searchSteps } from '../algorithms/linkedListOperations';

describe('linked list operation step generators', () => {
  it('insert at head works', () => {
    expect(finalListFromSteps(insertHeadSteps([2, 3], 1))).toEqual([1, 2, 3]);
  });

  it('insert at tail works', () => {
    expect(finalListFromSteps(insertTailSteps([1, 2], 3))).toEqual([1, 2, 3]);
  });

  it('insert at index works', () => {
    expect(finalListFromSteps(insertAtIndexSteps([1, 3], 2, 1))).toEqual([1, 2, 3]);
  });

  it('delete by value works', () => {
    expect(finalListFromSteps(deleteByValueSteps([1, 2, 3], 2))).toEqual([1, 3]);
  });

  it('delete at index works', () => {
    expect(finalListFromSteps(deleteAtIndexSteps([1, 2, 3], 1))).toEqual([1, 3]);
  });

  it('search returns correct result', () => {
    expect(searchSteps([4, 5, 6], 5).at(-1)?.result).toBe(1);
    expect(searchSteps([4, 5, 6], 10).at(-1)?.result).toBe(-1);
  });

  it('reverse works', () => {
    expect(finalListFromSteps(reverseSteps([1, 2, 3]))).toEqual([3, 2, 1]);
  });

  it('invalid operations are handled safely', () => {
    expect(insertAtIndexSteps([1], 2, 4)[0].warning).toBe('Invalid index');
    expect(deleteAtIndexSteps([], 0)[0].warning).toBe('Invalid index');
    expect(deleteByValueSteps([1], 99).at(-1)?.warning).toBe('Missing value');
  });
});
