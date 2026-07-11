import { swap } from '../../../lib/utils/arrays';
import { nextStepId, resetStepIdCounter } from '../../../lib/utils/id';
import type { HeapOrder, HeapStep } from '../heapTypes';

/** True when `a` should sit above `b` in a heap of the given order. */
function hasPriority(order: HeapOrder, a: number, b: number): boolean {
  return order === 'min' ? a < b : a > b;
}

function extremeWord(order: HeapOrder): string {
  return order === 'min' ? 'smallest' : 'largest';
}

function step(
  order: HeapOrder,
  action: HeapStep['action'],
  heap: number[],
  description: string,
  extra: Partial<HeapStep> = {},
): HeapStep {
  return {
    id: nextStepId('heap'),
    action,
    heap: [...heap],
    description,
    valid: isValidHeap(heap, order),
    ...extra,
  };
}

/** Validates the heap property for either a min- or max-heap. */
export function isValidHeap(heap: number[], order: HeapOrder = 'min'): boolean {
  for (let i = 0; i < heap.length; i += 1) {
    const left = i * 2 + 1;
    const right = i * 2 + 2;
    // A parent must not have lower priority than either child.
    if (left < heap.length && hasPriority(order, heap[left], heap[i])) return false;
    if (right < heap.length && hasPriority(order, heap[right], heap[i])) return false;
  }
  return true;
}

/** Backwards-compatible min-heap validity check. */
export function isValidMinHeap(heap: number[]): boolean {
  return isValidHeap(heap, 'min');
}

export function heapPeekSteps(input: number[], order: HeapOrder = 'min'): HeapStep[] {
  resetStepIdCounter();
  const heap = [...input];
  if (heap.length === 0) {
    return [step(order, 'empty', heap, 'The heap is empty, so peek returns nothing.', { result: undefined })];
  }
  return [step(order, 'peek', heap, `Peek returns the root value ${heap[0]} without changing the heap.`, { result: heap[0], codeLine: 1 })];
}

export function heapInsertSteps(input: number[], value: number, order: HeapOrder = 'min'): HeapStep[] {
  resetStepIdCounter();
  const heap = [...input];
  const steps: HeapStep[] = [step(order, 'initial', heap, `Start with the current ${order}-heap.`)];
  heap.push(value);
  let index = heap.length - 1;
  steps.push(step(order, 'insert', heap, `Insert ${value} at the next open array slot.`, { comparedIndices: [index], codeLine: 1 }));

  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    steps.push(step(order, 'compare', heap, `Compare child ${heap[index]} with parent ${heap[parent]}.`, { comparedIndices: [index, parent], codeLine: 3 }));
    if (!hasPriority(order, heap[index], heap[parent])) break;
    swap(heap, parent, index);
    steps.push(step(order, 'swap', heap, `Swap because ${heap[parent]} belongs above ${heap[index]}.`, { swappedIndices: [parent, index], codeLine: 4 }));
    index = parent;
  }

  steps.push(step(order, 'complete', heap, `Insert complete. The ${order}-heap property is restored.`, { codeLine: 5 }));
  return steps;
}

export function heapExtractRootSteps(input: number[], order: HeapOrder = 'min'): HeapStep[] {
  resetStepIdCounter();
  const heap = [...input];
  if (heap.length === 0) {
    return [step(order, 'empty', heap, 'The heap is empty, so extract returns nothing.', { result: undefined })];
  }

  const steps: HeapStep[] = [step(order, 'initial', heap, `Start with the current ${order}-heap.`)];
  const root = heap[0];
  const last = heap.pop()!;
  if (heap.length > 0) heap[0] = last;
  steps.push(step(order, 'extract', heap, `Extract root ${root}; move the last value to the root.`, { result: root, comparedIndices: heap.length ? [0] : [], codeLine: 1 }));

  let index = 0;
  while (true) {
    const left = index * 2 + 1;
    const right = index * 2 + 2;
    let target = index;
    if (left < heap.length && hasPriority(order, heap[left], heap[target])) target = left;
    if (right < heap.length && hasPriority(order, heap[right], heap[target])) target = right;

    const compared = [index, left, right].filter((item) => item < heap.length);
    if (compared.length > 1) {
      steps.push(step(order, 'compare', heap, `Compare parent with its children to find the ${extremeWord(order)} value.`, { comparedIndices: compared, result: root, codeLine: 3 }));
    }
    if (target === index) break;
    swap(heap, index, target);
    steps.push(step(order, 'swap', heap, `Swap down so ${heap[index]} moves above ${heap[target]}.`, { swappedIndices: [index, target], result: root, codeLine: 4 }));
    index = target;
  }

  steps.push(step(order, 'complete', heap, `Extract complete. Returned ${root}.`, { result: root, codeLine: 5 }));
  return steps;
}

/** Backwards-compatible alias for extracting the root of a min-heap. */
export function heapExtractMinSteps(input: number[]): HeapStep[] {
  return heapExtractRootSteps(input, 'min');
}

export function heapifySteps(input: number[], order: HeapOrder = 'min'): HeapStep[] {
  resetStepIdCounter();
  const heap = [...input];
  const steps: HeapStep[] = [step(order, 'initial', heap, 'Start with the raw array.')];

  function bubbleDown(index: number): void {
    while (true) {
      const left = index * 2 + 1;
      const right = index * 2 + 2;
      let target = index;
      if (left < heap.length && hasPriority(order, heap[left], heap[target])) target = left;
      if (right < heap.length && hasPriority(order, heap[right], heap[target])) target = right;
      const compared = [index, left, right].filter((item) => item < heap.length);
      if (compared.length > 1) steps.push(step(order, 'compare', heap, `Heapify compares node ${index} with its children.`, { comparedIndices: compared, codeLine: 2 }));
      if (target === index) break;
      swap(heap, index, target);
      steps.push(step(order, 'swap', heap, `Swap index ${index} with ${extremeWord(order)} child ${target}.`, { swappedIndices: [index, target], codeLine: 3 }));
      index = target;
    }
  }

  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i -= 1) {
    steps.push(step(order, 'heapify', heap, `Bubble down from internal node ${i}.`, { comparedIndices: [i], codeLine: 1 }));
    bubbleDown(i);
  }

  steps.push(step(order, 'complete', heap, `Heapify complete. The array now satisfies the ${order}-heap property.`, { codeLine: 4 }));
  return steps;
}

export function finalHeapFromSteps(steps: HeapStep[]): number[] {
  return steps.at(-1)?.heap ?? [];
}
