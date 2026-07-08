import { nextStepId, resetStepIdCounter } from '../../../lib/utils/id';
import { swap } from '../../../lib/utils/arrays';
import type { SortAlgorithm, SortHighlights, SortStep } from '../sortingTypes';

function step(
  algorithm: SortAlgorithm,
  action: SortStep['action'],
  array: number[],
  description: string,
  highlights: SortHighlights = {},
  codeLine?: number,
): SortStep {
  return {
    id: nextStepId(algorithm),
    algorithm,
    action,
    description,
    codeLine,
    array: [...array],
    highlights,
  };
}

function finish(algorithm: SortAlgorithm, steps: SortStep[], array: number[]): SortStep[] {
  steps.push(
    step(
      algorithm,
      'complete',
      array,
      array.length === 0 ? 'The array is empty, so it is already sorted.' : 'Sorting complete. Every value is now in ascending order.',
      { sorted: array.map((_, index) => index) },
    ),
  );
  return steps;
}

export function generateSortSteps(algorithm: SortAlgorithm, input: number[]): SortStep[] {
  resetStepIdCounter();
  switch (algorithm) {
    case 'bubble':
      return bubbleSortSteps(input);
    case 'selection':
      return selectionSortSteps(input);
    case 'insertion':
      return insertionSortSteps(input);
    case 'merge':
      return mergeSortSteps(input);
    case 'quick':
      return quickSortSteps(input);
  }
}

export function finalArrayFromSortSteps(steps: SortStep[]): number[] {
  return steps.at(-1)?.array ?? [];
}

export function randomArray(size: number, min = 5, max = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

function bubbleSortSteps(input: number[]): SortStep[] {
  const algorithm = 'bubble' as const;
  const array = [...input];
  const steps: SortStep[] = [step(algorithm, 'initial', array, 'Start with the original array.')];
  const sorted = new Set<number>();

  for (let end = array.length - 1; end > 0; end -= 1) {
    let swapped = false;
    for (let i = 0; i < end; i += 1) {
      steps.push(
        step(
          algorithm,
          'compare',
          array,
          `Compare ${array[i]} and ${array[i + 1]}.`,
          { comparing: [i, i + 1], sorted: [...sorted] },
          4,
        ),
      );
      if (array[i] > array[i + 1]) {
        swap(array, i, i + 1);
        swapped = true;
        steps.push(
          step(
            algorithm,
            'swap',
            array,
            `Swap them because ${array[i + 1]} was greater than ${array[i]}.`,
            { swapping: [i, i + 1], sorted: [...sorted] },
            5,
          ),
        );
      }
    }
    sorted.add(end);
    steps.push(step(algorithm, 'mark-sorted', array, `Index ${end} is fixed in its final sorted position.`, { sorted: [...sorted] }, 1));
    if (!swapped) break;
  }
  if (array.length > 0) sorted.add(0);
  return finish(algorithm, steps, array);
}

function selectionSortSteps(input: number[]): SortStep[] {
  const algorithm = 'selection' as const;
  const array = [...input];
  const steps: SortStep[] = [step(algorithm, 'initial', array, 'Start with the unsorted array.')];
  const sorted = new Set<number>();

  for (let i = 0; i < array.length; i += 1) {
    let minIndex = i;
    steps.push(step(algorithm, 'compare', array, `Assume index ${i} holds the smallest unsorted value.`, { comparing: [i], sorted: [...sorted] }, 2));
    for (let j = i + 1; j < array.length; j += 1) {
      steps.push(
        step(
          algorithm,
          'compare',
          array,
          `Compare current minimum ${array[minIndex]} with ${array[j]}.`,
          { comparing: [minIndex, j], sorted: [...sorted], activeRange: [i, array.length - 1] },
          4,
        ),
      );
      if (array[j] < array[minIndex]) {
        minIndex = j;
        steps.push(step(algorithm, 'compare', array, `New minimum found at index ${minIndex}.`, { comparing: [minIndex], sorted: [...sorted] }, 5));
      }
    }
    if (minIndex !== i) {
      swap(array, i, minIndex);
      steps.push(step(algorithm, 'swap', array, `Swap the minimum value into index ${i}.`, { swapping: [i, minIndex], sorted: [...sorted] }, 6));
    }
    sorted.add(i);
    steps.push(step(algorithm, 'mark-sorted', array, `Index ${i} joins the sorted prefix.`, { sorted: [...sorted] }, 1));
  }
  return finish(algorithm, steps, array);
}

function insertionSortSteps(input: number[]): SortStep[] {
  const algorithm = 'insertion' as const;
  const array = [...input];
  const steps: SortStep[] = [step(algorithm, 'initial', array, 'Treat the first value as a sorted prefix.', { sorted: array.length ? [0] : [] })];

  for (let i = 1; i < array.length; i += 1) {
    const key = array[i];
    let j = i - 1;
    steps.push(step(algorithm, 'compare', array, `Pick ${key} and insert it into the sorted prefix.`, { comparing: [i], activeRange: [0, i] }, 2));
    while (j >= 0 && array[j] > key) {
      steps.push(step(algorithm, 'compare', array, `${array[j]} is greater than ${key}, so shift it right.`, { comparing: [j, j + 1], activeRange: [0, i] }, 4));
      array[j + 1] = array[j];
      steps.push(step(algorithm, 'overwrite', array, `Shift ${array[j]} from index ${j} to index ${j + 1}.`, { swapping: [j, j + 1], activeRange: [0, i] }, 5));
      j -= 1;
    }
    array[j + 1] = key;
    steps.push(step(algorithm, 'overwrite', array, `Place ${key} at index ${j + 1}.`, { comparing: [j + 1], sorted: Array.from({ length: i + 1 }, (_, index) => index) }, 7));
  }

  return finish(algorithm, steps, array);
}

function mergeSortSteps(input: number[]): SortStep[] {
  const algorithm = 'merge' as const;
  const array = [...input];
  const steps: SortStep[] = [step(algorithm, 'initial', array, 'Start merge sort on the full array.')];

  function merge(left: number, mid: number, right: number): void {
    const leftValues = array.slice(left, mid + 1);
    const rightValues = array.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    steps.push(step(algorithm, 'partition', array, `Merge sorted ranges [${left}, ${mid}] and [${mid + 1}, ${right}].`, { activeRange: [left, right] }, 6));

    while (i < leftValues.length && j < rightValues.length) {
      const takeLeft = leftValues[i] <= rightValues[j];
      steps.push(
        step(
          algorithm,
          'compare',
          array,
          `Compare ${leftValues[i]} and ${rightValues[j]}; take ${takeLeft ? leftValues[i] : rightValues[j]}.`,
          { comparing: [left + i, mid + 1 + j], activeRange: [left, right] },
          6,
        ),
      );
      array[k] = takeLeft ? leftValues[i++] : rightValues[j++];
      steps.push(step(algorithm, 'overwrite', array, `Write ${array[k]} into index ${k}.`, { comparing: [k], activeRange: [left, right] }, 6));
      k += 1;
    }

    while (i < leftValues.length) {
      array[k] = leftValues[i++];
      steps.push(step(algorithm, 'overwrite', array, `Copy remaining left value ${array[k]} into index ${k}.`, { comparing: [k], activeRange: [left, right] }, 6));
      k += 1;
    }

    while (j < rightValues.length) {
      array[k] = rightValues[j++];
      steps.push(step(algorithm, 'overwrite', array, `Copy remaining right value ${array[k]} into index ${k}.`, { comparing: [k], activeRange: [left, right] }, 6));
      k += 1;
    }
  }

  function sort(left: number, right: number): void {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    steps.push(step(algorithm, 'partition', array, `Split range [${left}, ${right}] at ${mid}.`, { activeRange: [left, right] }, 3));
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  }

  sort(0, array.length - 1);
  return finish(algorithm, steps, array);
}

function quickSortSteps(input: number[]): SortStep[] {
  const algorithm = 'quick' as const;
  const array = [...input];
  const steps: SortStep[] = [step(algorithm, 'initial', array, 'Start quick sort on the full array.')];
  const sorted = new Set<number>();

  function partition(low: number, high: number): number {
    const pivot = array[high];
    let i = low;
    steps.push(step(algorithm, 'pivot', array, `Choose ${pivot} at index ${high} as the pivot.`, { pivot: high, activeRange: [low, high], sorted: [...sorted] }, 3));

    for (let j = low; j < high; j += 1) {
      steps.push(step(algorithm, 'compare', array, `Compare ${array[j]} with pivot ${pivot}.`, { comparing: [j, high], pivot: high, activeRange: [low, high], sorted: [...sorted] }, 4));
      if (array[j] <= pivot) {
        if (i !== j) {
          swap(array, i, j);
          steps.push(step(algorithm, 'swap', array, `Move ${array[i]} into the <= pivot region.`, { swapping: [i, j], pivot: high, activeRange: [low, high], sorted: [...sorted] }, 4));
        }
        i += 1;
      }
    }

    swap(array, i, high);
    steps.push(step(algorithm, 'swap', array, `Place pivot ${pivot} into final index ${i}.`, { swapping: [i, high], pivot: i, activeRange: [low, high], sorted: [...sorted] }, 5));
    sorted.add(i);
    return i;
  }

  function sort(low: number, high: number): void {
    if (low > high) return;
    if (low === high) {
      sorted.add(low);
      steps.push(step(algorithm, 'mark-sorted', array, `Single-item range at index ${low} is already sorted.`, { sorted: [...sorted] }, 2));
      return;
    }
    const pivotIndex = partition(low, high);
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  }

  sort(0, array.length - 1);
  return finish(algorithm, steps, array);
}
