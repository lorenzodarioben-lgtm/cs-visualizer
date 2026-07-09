import type { AlgorithmStep } from '../../lib/animation/step';

export type HeapAction = 'initial' | 'compare' | 'swap' | 'insert' | 'extract' | 'peek' | 'heapify' | 'complete' | 'empty';

export type HeapStep = AlgorithmStep & {
  action: HeapAction;
  heap: number[];
  comparedIndices?: number[];
  swappedIndices?: number[];
  result?: number;
  valid: boolean;
};
