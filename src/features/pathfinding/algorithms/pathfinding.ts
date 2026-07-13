import { nextStepId, resetStepIdCounter } from '../../../lib/utils/id';
import { cellKey, coordKey } from '../pathfindingTypes';
import type { Grid, PathAlgorithm, PathStep } from '../pathfindingTypes';
import { isSameCoord, manhattan, neighbors } from './grid';

type Search = {
  order: string[]; // cells expanded, in order
  cameFrom: Map<string, string>;
  found: boolean;
};

/** Reconstruct the path from end back to start using the cameFrom links. */
function reconstructPath(cameFrom: Map<string, string>, startKey: string, endKey: string): string[] {
  const path: string[] = [];
  let currentKey: string | undefined = endKey;
  while (currentKey && currentKey !== startKey) {
    path.push(currentKey);
    currentKey = cameFrom.get(currentKey);
    if (path.length > 100000) break; // safety valve against cycles
  }
  if (currentKey === startKey) path.push(startKey);
  return path.reverse();
}

/** Breadth-first search: explores in rings, optimal for unweighted grids. */
function bfsSearch(grid: Grid): Search {
  const startKey = coordKey(grid.start);
  const endKey = coordKey(grid.end);
  const queue: string[] = [startKey];
  const seen = new Set<string>([startKey]);
  const cameFrom = new Map<string, string>();
  const order: string[] = [];

  while (queue.length > 0) {
    const currentKey = queue.shift()!;
    order.push(currentKey);
    if (currentKey === endKey) return { order, cameFrom, found: true };
    const [row, col] = currentKey.split('-').map(Number);
    for (const neighbor of neighbors(grid, row, col)) {
      const key = cellKey(neighbor.row, neighbor.col);
      if (seen.has(key)) continue;
      seen.add(key);
      cameFrom.set(key, currentKey);
      queue.push(key);
    }
  }
  return { order, cameFrom, found: false };
}

/** Uniform-cost / A* search. Uses a Manhattan heuristic when `heuristic` is true. */
function weightedSearch(grid: Grid, heuristic: boolean): Search {
  const startKey = coordKey(grid.start);
  const endKey = coordKey(grid.end);
  const dist = new Map<string, number>([[startKey, 0]]);
  const cameFrom = new Map<string, string>();
  const closed = new Set<string>();
  const open = new Set<string>([startKey]);
  const order: string[] = [];

  const priority = (key: string): number => {
    const g = dist.get(key) ?? Infinity;
    if (!heuristic) return g;
    const [row, col] = key.split('-').map(Number);
    return g + manhattan({ row, col }, grid.end);
  };

  while (open.size > 0) {
    let currentKey = '';
    let best = Infinity;
    for (const key of open) {
      const score = priority(key);
      if (score < best) {
        best = score;
        currentKey = key;
      }
    }
    open.delete(currentKey);
    closed.add(currentKey);
    order.push(currentKey);
    if (currentKey === endKey) return { order, cameFrom, found: true };

    const [row, col] = currentKey.split('-').map(Number);
    const currentDist = dist.get(currentKey) ?? Infinity;
    for (const neighbor of neighbors(grid, row, col)) {
      const key = cellKey(neighbor.row, neighbor.col);
      if (closed.has(key)) continue;
      const tentative = currentDist + neighbor.weight;
      if (tentative < (dist.get(key) ?? Infinity)) {
        dist.set(key, tentative);
        cameFrom.set(key, currentKey);
        open.add(key);
      }
    }
  }
  return { order, cameFrom, found: false };
}

function runSearch(grid: Grid, algorithm: PathAlgorithm): Search {
  switch (algorithm) {
    case 'bfs':
      return bfsSearch(grid);
    case 'dijkstra':
      return weightedSearch(grid, false);
    case 'astar':
      return weightedSearch(grid, true);
  }
}

/**
 * Generate an animation timeline for a pathfinding run: one step per expanded
 * cell, followed by an animated trace of the reconstructed shortest path.
 */
export function generatePathSteps(grid: Grid, algorithm: PathAlgorithm): PathStep[] {
  resetStepIdCounter();
  const startKey = coordKey(grid.start);
  const endKey = coordKey(grid.end);

  const steps: PathStep[] = [
    {
      id: nextStepId('path'),
      action: 'init',
      description: 'Begin the search from the start cell.',
      current: startKey,
      visited: [],
      frontier: [startKey],
      path: [],
      visitedCount: 0,
      codeLine: 1,
    },
  ];

  if (isSameCoord(grid.start, grid.end)) {
    steps.push({
      id: nextStepId('path'),
      action: 'done',
      description: 'The start and end cells are the same.',
      current: startKey,
      visited: [startKey],
      frontier: [],
      path: [startKey],
      visitedCount: 1,
      codeLine: 2,
    });
    return steps;
  }

  const { order, cameFrom, found } = runSearch(grid, algorithm);
  const visited: string[] = [];
  const frontier = new Set<string>([startKey]);

  for (const key of order) {
    visited.push(key);
    frontier.delete(key);
    const [row, col] = key.split('-').map(Number);
    for (const neighbor of neighbors(grid, row, col)) {
      const neighborKey = cellKey(neighbor.row, neighbor.col);
      if (!visited.includes(neighborKey)) frontier.add(neighborKey);
    }
    const reachedEnd = key === endKey;
    steps.push({
      id: nextStepId('path'),
      action: reachedEnd ? 'done' : 'visit',
      description: reachedEnd
        ? 'Reached the target cell, reconstructing the shortest path.'
        : `Expand cell (${row}, ${col}) and discover its neighbours.`,
      current: key,
      visited: [...visited],
      frontier: [...frontier],
      path: [],
      visitedCount: visited.length,
      codeLine: 4,
    });
    if (reachedEnd) break;
  }

  if (!found) {
    steps.push({
      id: nextStepId('path'),
      action: 'no-path',
      description: 'The target cell is walled off, so no path exists.',
      current: null,
      visited: [...visited],
      frontier: [],
      path: [],
      visitedCount: visited.length,
      codeLine: 6,
    });
    return steps;
  }

  const path = reconstructPath(cameFrom, startKey, endKey);
  for (let i = 0; i < path.length; i += 1) {
    steps.push({
      id: nextStepId('path'),
      action: 'path',
      description:
        i === path.length - 1
          ? `Shortest path found in ${path.length} cells.`
          : 'Trace the shortest path back from the target.',
      current: path[i],
      visited,
      frontier: [],
      path: path.slice(0, i + 1),
      visitedCount: visited.length,
      codeLine: 7,
    });
  }

  return steps;
}

/** Convenience helper for tests: the final shortest path for a grid/algorithm. */
export function shortestPath(grid: Grid, algorithm: PathAlgorithm): string[] {
  const steps = generatePathSteps(grid, algorithm);
  return steps.at(-1)?.path ?? [];
}
