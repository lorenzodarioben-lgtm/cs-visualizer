import type { Coord, Grid, GridCell } from '../pathfindingTypes';

export const HEAVY_WEIGHT = 5;

export function createGrid(rows: number, cols: number, start?: Coord, end?: Coord): Grid {
  const cells: GridCell[][] = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({ row, col, wall: false, weight: 1 })),
  );
  return {
    rows,
    cols,
    cells,
    start: start ?? { row: Math.floor(rows / 2), col: 1 },
    end: end ?? { row: Math.floor(rows / 2), col: cols - 2 },
  };
}

export function cloneGrid(grid: Grid): Grid {
  return {
    ...grid,
    start: { ...grid.start },
    end: { ...grid.end },
    cells: grid.cells.map((row) => row.map((cell) => ({ ...cell }))),
  };
}

export function isSameCoord(a: Coord, b: Coord): boolean {
  return a.row === b.row && a.col === b.col;
}

export function inBounds(grid: Grid, row: number, col: number): boolean {
  return row >= 0 && row < grid.rows && col >= 0 && col < grid.cols;
}

/** Orthogonal neighbours (4-directional) that are inside the grid and not walls. */
export function neighbors(grid: Grid, row: number, col: number): GridCell[] {
  const deltas = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const result: GridCell[] = [];
  for (const [dr, dc] of deltas) {
    const nr = row + dr;
    const nc = col + dc;
    if (inBounds(grid, nr, nc) && !grid.cells[nr][nc].wall) {
      result.push(grid.cells[nr][nc]);
    }
  }
  return result;
}

export function manhattan(a: Coord, b: Coord): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * Deterministic "maze" of walls and heavy terrain based on a seeded pattern.
 * Keeps the start and end cells clear so a path always has a chance to exist.
 */
export function randomObstacles(grid: Grid, seed = 1, wallRatio = 0.28): Grid {
  const next = cloneGrid(grid);
  let state = seed * 9301 + 49297;
  const rand = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
  for (let row = 0; row < next.rows; row += 1) {
    for (let col = 0; col < next.cols; col += 1) {
      if (isSameCoord({ row, col }, next.start) || isSameCoord({ row, col }, next.end)) continue;
      const roll = rand();
      if (roll < wallRatio) {
        next.cells[row][col].wall = true;
      } else if (roll < wallRatio + 0.12) {
        next.cells[row][col].weight = HEAVY_WEIGHT;
      }
    }
  }
  return next;
}
