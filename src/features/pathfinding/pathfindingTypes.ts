import type { AlgorithmStep } from '../../lib/animation/step';

export type PathAlgorithm = 'bfs' | 'dijkstra' | 'astar';

export type Coord = { row: number; col: number };

export type GridCell = {
  row: number;
  col: number;
  wall: boolean;
  /** Movement cost to enter this cell. 1 for normal terrain, higher for "heavy" terrain. */
  weight: number;
};

export type Grid = {
  rows: number;
  cols: number;
  cells: GridCell[][];
  start: Coord;
  end: Coord;
};

export type PathAction = 'init' | 'visit' | 'frontier' | 'path' | 'done' | 'no-path';

export type PathStep = AlgorithmStep & {
  action: PathAction;
  /** Cell being expanded this step, as a "row-col" key. */
  current: string | null;
  /** Cells finalized (dequeued/closed). */
  visited: string[];
  /** Cells discovered but not yet expanded (open set). */
  frontier: string[];
  /** Final shortest path, populated once the target is reached. */
  path: string[];
  /** Cells that make up the reconstructed path so far (for the animated trace). */
  visitedCount: number;
};

export type PathInfo = {
  label: string;
  concept: string;
  weighted: boolean;
  optimal: string;
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode: string[];
};

export function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

export function coordKey(coord: Coord): string {
  return cellKey(coord.row, coord.col);
}
