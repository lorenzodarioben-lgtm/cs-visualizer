import { swap } from '../../../lib/utils/arrays';
import { nextStepId, resetStepIdCounter } from '../../../lib/utils/id';
import type { HeapStep } from '../heapTypes';

function step(action: HeapStep['action'], heap: number[], description: string, extra: Partial<HeapStep> = {}): HeapStep {
  return {
    id: nextStepId('heap'),
    action,
    heap: [...heap],
    description,
    valid: isValidMinHeap(heap),
    ...extra,
  };
}

export function isValidMinHeap(heap: number[]): boolean {
  for (let i = 0; i < heap.length; i += 1) {
    const left = i * 2 + 1;
    const right = i * 2 + 2;
    if (left < heap.length && heap[i] > heap[left]) return false;
    if (right < heap.length && heap[i] > heap[right]) return false;
  }
  return true;
}

export function heapPeekSteps(input: number[]): HeapStep[] {
  resetStepIdCounter();
  const heap = [...input];
  if (heap.length === 0) {
    return [step('empty', heap, 'The heap is empty, so peek returns nothing.', { result: undefined })];
  }
  return [step('peek', heap, `Peek returns the root value ${heap[0]} without changing the heap.`, { result: heap[0], codeLine: 1 })];
}

export function heapInsertSteps(input: number[], value: number): HeapStep[] {
  resetStepIdCounter();
  const heap = [...input];
  const steps: HeapStep[] = [step('initial', heap, 'Start with the current min-heap.')];
  heap.push(value);
  let index = heap.length - 1;
  steps.push(step('insert', heap, `Insert ${value} at the next open array slot.`, { comparedIndices: [index], codeLine: 1 }));

  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    steps.push(step('compare', heap, `Compare child ${heap[index]} with parent ${heap[parent]}.`, { comparedIndices: [index, parent], codeLine: 3 }));
    if (heap[parent] <= heap[index]) break;
    swap(heap, parent, index);
    steps.push(step('swap', heap, `Swap because ${heap[index]} was greater than child ${heap[parent]}.`, { swappedIndices: [parent, index], codeLine: 4 }));
    index = parent;
  }

  steps.push(step('complete', heap, 'Insert complete. The min-heap property is restored.', { codeLine: 5 }));
  return steps;
}

export function heapExtractMinSteps(input: number[]): HeapStep[] {
  resetStepIdCounter();
  const heap = [...input];
  if (heap.length === 0) {
    return [step('empty', heap, 'The heap is empty, so extract returns nothing.', { result: undefined })];
  }

  const steps: HeapStep[] = [step('initial', heap, 'Start with the current min-heap.')];
  const min = heap[0];
  const last = heap.pop()!;
  if (heap.length > 0) heap[0] = last;
  steps.push(step('extract', heap, `Extract root ${min}; move the last value to the root.`, { result: min, comparedIndices: heap.length ? [0] : [], codeLine: 1 }));

  let index = 0;
  while (true) {
    const left = index * 2 + 1;
    const right = index * 2 + 2;
    let smallest = index;
    if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
    if (right < heap.length && heap[right] < heap[smallest]) smallest = right;

    const compared = [index, left, right].filter((item) => item < heap.length);
    if (compared.length > 1) {
      steps.push(step('compare', heap, 'Compare parent with its children to find the smallest value.', { comparedIndices: compared, result: min, codeLine: 3 }));
    }
    if (smallest === index) break;
    swap(heap, index, smallest);
    steps.push(step('swap', heap, `Swap down so ${heap[smallest]} moves below ${heap[index]}.`, { swappedIndices: [index, smallest], result: min, codeLine: 4 }));
    index = smallest;
  }

  steps.push(step('complete', heap, `Extract complete. Returned ${min}.`, { result: min, codeLine: 5 }));
  return steps;
}

export function heapifySteps(input: number[]): HeapStep[] {
  resetStepIdCounter();
  const heap = [...input];
  const steps: HeapStep[] = [step('initial', heap, 'Start with the raw array.')];

  function bubbleDown(index: number): void {
    while (true) {
      const left = index * 2 + 1;
      const right = index * 2 + 2;
      let smallest = index;
      if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
      if (right < heap.length && heap[right] < heap[smallest]) smallest = right;
      const compared = [index, left, right].filter((item) => item < heap.length);
      if (compared.length > 1) steps.push(step('compare', heap, `Heapify compares node ${index} with its children.`, { comparedIndices: compared, codeLine: 2 }));
      if (smallest === index) break;
      swap(heap, index, smallest);
      steps.push(step('swap', heap, `Swap index ${index} with smaller child ${smallest}.`, { swappedIndices: [index, smallest], codeLine: 3 }));
      index = smallest;
    }
  }

  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i -= 1) {
    steps.push(step('heapify', heap, `Bubble down from internal node ${i}.`, { comparedIndices: [i], codeLine: 1 }));
    bubbleDown(i);
  }

  steps.push(step('complete', heap, 'Heapify complete. The array now satisfies the min-heap property.', { codeLine: 4 }));
  return steps;
}

export function finalHeapFromSteps(steps: HeapStep[]): number[] {
  return steps.at(-1)?.heap ?? [];
}
