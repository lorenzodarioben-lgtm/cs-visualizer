import type { AlgorithmStep } from '../../lib/animation/step';

export type LinkedListOperation = 'insert-head' | 'insert-tail' | 'insert-index' | 'delete-value' | 'delete-index' | 'search' | 'reverse';

export type LinkedListStep = AlgorithmStep & {
  operation: LinkedListOperation;
  list: number[];
  currentIndex?: number;
  previousIndex?: number;
  targetIndex?: number;
  result?: number | boolean | null;
  warning?: string;
};
