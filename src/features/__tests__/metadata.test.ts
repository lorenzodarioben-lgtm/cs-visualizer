import { describe, expect, it } from 'vitest';
import { SORT_INFO } from '../sorting/algorithms/sortInfo';
import { PATH_INFO } from '../pathfinding/algorithms/pathInfo';
import type { SortAlgorithm } from '../sorting/sortingTypes';
import type { PathAlgorithm } from '../pathfinding/pathfindingTypes';

const SORT_ALGORITHMS: SortAlgorithm[] = ['bubble', 'selection', 'insertion', 'merge', 'quick'];
const PATH_ALGORITHMS: PathAlgorithm[] = ['bfs', 'dijkstra', 'astar'];

describe('SORT_INFO metadata', () => {
  it.each(SORT_ALGORITHMS)('has complete, non-empty metadata for %s', (algorithm) => {
    const info = SORT_INFO[algorithm];
    expect(info.label.length).toBeGreaterThan(0);
    expect(info.concept.length).toBeGreaterThan(20);
    expect(info.timeComplexity).toMatch(/O\(/);
    expect(info.spaceComplexity).toMatch(/O\(/);
    expect(info.useCases.length).toBeGreaterThan(0);
    expect(info.edgeCases.length).toBeGreaterThan(0);
    expect(info.pseudocode.length).toBeGreaterThan(2);
  });

  it('has an entry for every algorithm and no extras', () => {
    expect(Object.keys(SORT_INFO).sort()).toEqual([...SORT_ALGORITHMS].sort());
  });
});

describe('PATH_INFO metadata', () => {
  it.each(PATH_ALGORITHMS)('has complete, non-empty metadata for %s', (algorithm) => {
    const info = PATH_INFO[algorithm];
    expect(info.label.length).toBeGreaterThan(0);
    expect(info.concept.length).toBeGreaterThan(20);
    expect(info.optimal.length).toBeGreaterThan(0);
    expect(info.timeComplexity).toMatch(/O\(/);
    expect(info.spaceComplexity).toMatch(/O\(/);
    expect(info.pseudocode.length).toBeGreaterThan(2);
  });

  it('marks weighted algorithms correctly', () => {
    expect(PATH_INFO.bfs.weighted).toBe(false);
    expect(PATH_INFO.dijkstra.weighted).toBe(true);
    expect(PATH_INFO.astar.weighted).toBe(true);
  });
});
