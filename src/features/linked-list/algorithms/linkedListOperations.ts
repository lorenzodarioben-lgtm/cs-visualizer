import { nextStepId, resetStepIdCounter } from '../../../lib/utils/id';
import type { LinkedListOperation, LinkedListStep } from '../linkedListTypes';

function step(operation: LinkedListOperation, list: number[], description: string, extra: Partial<LinkedListStep> = {}): LinkedListStep {
  return {
    id: nextStepId('list'),
    operation,
    list: [...list],
    description,
    ...extra,
  };
}

export function insertHeadSteps(input: number[], value: number): LinkedListStep[] {
  resetStepIdCounter();
  const list = [...input];
  const steps = [step('insert-head', list, 'Point the new node at the current head.', { codeLine: 1 })];
  list.unshift(value);
  steps.push(step('insert-head', list, `The new node ${value} becomes the head.`, { targetIndex: 0, codeLine: 2 }));
  return steps;
}

export function insertTailSteps(input: number[], value: number): LinkedListStep[] {
  resetStepIdCounter();
  const list = [...input];
  const steps: LinkedListStep[] = [step('insert-tail', list, 'Start at head and walk to the tail.', { codeLine: 1 })];
  for (let i = 0; i < list.length; i += 1) {
    steps.push(step('insert-tail', list, `Visit node at index ${i}.`, { currentIndex: i, codeLine: 2 }));
  }
  list.push(value);
  steps.push(step('insert-tail', list, `Append ${value} after the old tail.`, { targetIndex: list.length - 1, codeLine: 3 }));
  return steps;
}

export function insertAtIndexSteps(input: number[], value: number, index: number): LinkedListStep[] {
  resetStepIdCounter();
  const list = [...input];
  if (index < 0 || index > list.length) {
    return [step('insert-index', list, `Index ${index} is invalid for list length ${list.length}.`, { warning: 'Invalid index', result: false })];
  }
  if (index === 0) return insertHeadSteps(input, value).map((item) => ({ ...item, operation: 'insert-index' as const }));
  const steps: LinkedListStep[] = [step('insert-index', list, `Walk to node before index ${index}.`, { codeLine: 1 })];
  for (let i = 0; i < index; i += 1) {
    steps.push(step('insert-index', list, `Pointer moves through index ${i}.`, { currentIndex: i, previousIndex: i - 1 >= 0 ? i - 1 : undefined, codeLine: 2 }));
  }
  list.splice(index, 0, value);
  steps.push(step('insert-index', list, `Link ${value} into index ${index}.`, { targetIndex: index, previousIndex: index - 1, codeLine: 3 }));
  return steps;
}

export function deleteByValueSteps(input: number[], value: number): LinkedListStep[] {
  resetStepIdCounter();
  const list = [...input];
  const steps: LinkedListStep[] = [step('delete-value', list, `Search for value ${value}.`, { codeLine: 1 })];
  const index = list.indexOf(value);
  for (let i = 0; i < list.length; i += 1) {
    steps.push(step('delete-value', list, `Check node ${i} with value ${list[i]}.`, { currentIndex: i, previousIndex: i - 1 >= 0 ? i - 1 : undefined, codeLine: 2 }));
    if (i === index) break;
  }
  if (index === -1) {
    steps.push(step('delete-value', list, `${value} was not found; the list is unchanged.`, { warning: 'Missing value', result: false, codeLine: 3 }));
    return steps;
  }
  list.splice(index, 1);
  steps.push(step('delete-value', list, `Bypass the node that held ${value}.`, { previousIndex: index - 1 >= 0 ? index - 1 : undefined, targetIndex: index, result: true, codeLine: 4 }));
  return steps;
}

export function deleteAtIndexSteps(input: number[], index: number): LinkedListStep[] {
  resetStepIdCounter();
  const list = [...input];
  if (index < 0 || index >= list.length) {
    return [step('delete-index', list, `Index ${index} is invalid for list length ${list.length}.`, { warning: 'Invalid index', result: false })];
  }
  const steps: LinkedListStep[] = [step('delete-index', list, `Walk to index ${index}.`, { codeLine: 1 })];
  for (let i = 0; i <= index; i += 1) {
    steps.push(step('delete-index', list, `Visit node ${i}.`, { currentIndex: i, previousIndex: i - 1 >= 0 ? i - 1 : undefined, codeLine: 2 }));
  }
  const removed = list[index];
  list.splice(index, 1);
  steps.push(step('delete-index', list, `Remove node ${removed} at index ${index}.`, { targetIndex: index, result: removed, codeLine: 3 }));
  return steps;
}

export function searchSteps(input: number[], value: number): LinkedListStep[] {
  resetStepIdCounter();
  const list = [...input];
  const steps: LinkedListStep[] = [step('search', list, `Search for ${value} from the head.`, { codeLine: 1 })];
  for (let i = 0; i < list.length; i += 1) {
    steps.push(step('search', list, `Compare node ${i} value ${list[i]} with ${value}.`, { currentIndex: i, codeLine: 2 }));
    if (list[i] === value) {
      steps.push(step('search', list, `Found ${value} at index ${i}.`, { targetIndex: i, result: i, codeLine: 3 }));
      return steps;
    }
  }
  steps.push(step('search', list, `${value} is not in the list.`, { result: -1, warning: 'Missing value', codeLine: 4 }));
  return steps;
}

export function reverseSteps(input: number[]): LinkedListStep[] {
  resetStepIdCounter();
  const original = [...input];
  const reversed = [...input];
  const steps: LinkedListStep[] = [step('reverse', original, 'Initialize previous = null and current = head.', { codeLine: 1 })];
  for (let i = 0; i < original.length; i += 1) {
    steps.push(step('reverse', original, `Redirect node ${i} to point backward.`, { currentIndex: i, previousIndex: i - 1 >= 0 ? i - 1 : undefined, codeLine: 3 }));
  }
  reversed.reverse();
  steps.push(step('reverse', reversed, 'Move head to the old tail. The list is reversed.', { targetIndex: 0, result: true, codeLine: 5 }));
  return steps;
}

export function finalListFromSteps(steps: LinkedListStep[]): number[] {
  return steps.at(-1)?.list ?? [];
}
