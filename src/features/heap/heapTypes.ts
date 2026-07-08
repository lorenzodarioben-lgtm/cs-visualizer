export type HeapAction = 'initial' | 'compare' | 'swap' | 'insert' | 'extract' | 'peek' | 'heapify' | 'complete' | 'empty';

export type HeapStep = {
  id: string;
  action: HeapAction;
  description: string;
  codeLine?: number;
  heap: number[];
  comparedIndices?: number[];
  swappedIndices?: number[];
  result?: number;
  valid: boolean;
};
