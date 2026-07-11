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
  /**
   * Stable identity of the element occupying each position. Positions that
   * genuinely swap elements carry their id along, which lets the UI animate a
   * swap as two bars exchanging places rather than changing height.
   */
  ids: number[];
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
