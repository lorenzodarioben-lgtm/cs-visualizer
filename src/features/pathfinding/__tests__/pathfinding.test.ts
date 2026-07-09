import { describe, expect, it } from 'vitest';
import { createGrid, HEAVY_WEIGHT, isSameCoord } from '../algorithms/grid';
import { generatePathSteps, shortestPath } from '../algorithms/pathfinding';
import { coordKey } from '../pathfindingTypes';
import type { PathAlgorithm } from '../pathfindingTypes';

const ALGORITHMS: PathAlgorithm[] = ['bfs', 'dijkstra', 'astar'];

function openGrid() {
  // 5x5 grid, start at (2,1), end at (2,3) -> Manhattan distance 2.
  return createGrid(5, 5, { row: 2, col: 1 }, { row: 2, col: 3 });
}

describe('pathfinding grid helpers', () => {
  it('creates a grid with clear start and end', () => {
    const grid = createGrid(6, 8);
    expect(grid.rows).toBe(6);
    expect(grid.cols).toBe(8);
    expect(grid.cells[grid.start.row][grid.start.col].wall).toBe(false);
    expect(isSameCoord(grid.start, grid.end)).toBe(false);
  });
});

describe('generatePathSteps', () => {
  it.each(ALGORITHMS)('finds a shortest-length path on an open grid with %s', (algorithm) => {
    const grid = openGrid();
    const path = shortestPath(grid, algorithm);
    expect(path[0]).toBe(coordKey(grid.start));
    expect(path.at(-1)).toBe(coordKey(grid.end));
    // Manhattan distance is 2, so the path has 3 cells (start + 2 moves).
    expect(path).toHaveLength(3);
  });

  it.each(ALGORITHMS)('marks the target as reached with %s', (algorithm) => {
    const grid = openGrid();
    const steps = generatePathSteps(grid, algorithm);
    expect(steps.some((step) => step.action === 'done')).toBe(true);
    expect(steps.some((step) => step.action === 'path')).toBe(true);
    expect(steps.every((step) => step.visitedCount >= 0)).toBe(true);
  });

  it.each(ALGORITHMS)('reports no path when the target is walled off with %s', (algorithm) => {
    const grid = createGrid(5, 5, { row: 2, col: 2 }, { row: 0, col: 0 });
    // Wall off the corner target completely.
    grid.cells[0][1].wall = true;
    grid.cells[1][0].wall = true;
    const steps = generatePathSteps(grid, algorithm);
    expect(steps.at(-1)?.action).toBe('no-path');
    expect(steps.at(-1)?.path).toHaveLength(0);
  });

  it('returns a trivial path when start equals end', () => {
    const grid = createGrid(4, 4, { row: 1, col: 1 }, { row: 1, col: 1 });
    const path = shortestPath(grid, 'bfs');
    expect(path).toEqual([coordKey(grid.start)]);
  });

  it('lets Dijkstra route around heavy terrain that BFS walks through', () => {
    // Straight corridor row 0; the direct route has a heavy tile, a detour via row 1 is cheaper.
    const grid = createGrid(2, 3, { row: 0, col: 0 }, { row: 0, col: 2 });
    grid.cells[0][1].weight = HEAVY_WEIGHT; // expensive middle tile on the direct path
    const bfs = shortestPath(grid, 'bfs');
    const dijkstra = shortestPath(grid, 'dijkstra');
    // BFS ignores weight and takes the 3-cell straight line.
    expect(bfs).toHaveLength(3);
    // Dijkstra detours through row 1 to avoid the heavy tile (5 cells, lower total cost).
    expect(dijkstra).toHaveLength(5);
    expect(dijkstra).not.toContain(coordKey({ row: 0, col: 1 }));
  });

  it('produces a monotonically growing visited set', () => {
    const grid = openGrid();
    const steps = generatePathSteps(grid, 'astar');
    const visitSteps = steps.filter((step) => step.action === 'visit' || step.action === 'done');
    for (let i = 1; i < visitSteps.length; i += 1) {
      expect(visitSteps[i].visited.length).toBeGreaterThanOrEqual(visitSteps[i - 1].visited.length);
    }
  });
});
