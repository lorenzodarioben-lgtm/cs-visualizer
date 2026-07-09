import type { AlgorithmStep } from '../../lib/animation/step';

export type SortAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';

export type SortAction =
  | 'initial'
  | 'compare'
  | 'swap'
  | 'overwrite'
  | 'mark-sorted'
  | 'pivot'
  | 'partition'
  | 'complete';

export type SortHighlights = {
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  pivot?: number;
  activeRange?: [number, number];
};

export type SortStep = AlgorithmStep & {
  algorithm: SortAlgorithm;
  action: SortAction;
  array: number[];
  highlights: SortHighlights;
};

export type SortInfo = {
  label: string;
  concept: string;
  timeComplexity: string;
  spaceComplexity: string;
  useCases: string[];
  edgeCases: string[];
  pseudocode: string[];
};
