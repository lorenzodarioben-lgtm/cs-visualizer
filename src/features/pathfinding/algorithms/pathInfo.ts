import type { PathAlgorithm, PathInfo } from '../pathfindingTypes';

export const PATH_INFO: Record<PathAlgorithm, PathInfo> = {
  bfs: {
    label: 'Breadth-First Search',
    concept:
      'BFS expands cells in expanding rings from the start. On an unweighted grid every edge costs the same, so the first time it reaches the target it has found a shortest path.',
    weighted: false,
    optimal: 'Optimal on unweighted grids; ignores terrain weights.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'queue = [start]',
      'while queue not empty',
      '  current = queue.dequeue()',
      '  if current == end: stop',
      '  for neighbor in neighbors(current)',
      '    if unseen: record and enqueue',
      'reconstruct path from end',
    ],
  },
  dijkstra: {
    label: "Dijkstra's Algorithm",
    concept:
      'Dijkstra always expands the discovered cell with the smallest total cost from the start. It respects terrain weights, guaranteeing a least-cost path even when some tiles are expensive to cross.',
    weighted: true,
    optimal: 'Optimal on weighted grids; explores broadly in all directions.',
    timeComplexity: 'O(E log V) with a priority queue',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'dist[start] = 0; open = {start}',
      'while open not empty',
      '  current = min cost cell in open',
      '  if current == end: stop',
      '  for neighbor in neighbors(current)',
      '    relax dist through current',
      'reconstruct path from end',
    ],
  },
  astar: {
    label: 'A* Search',
    concept:
      'A* is Dijkstra guided by a heuristic. It prioritises cells by cost-so-far plus an estimate (Manhattan distance) of the cost remaining, so it heads toward the target and usually explores far fewer cells.',
    weighted: true,
    optimal: 'Optimal with an admissible heuristic; explores toward the target.',
    timeComplexity: 'O(E) with a good heuristic',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'f = g + h(Manhattan to end)',
      'open = {start}',
      '  current = lowest f in open',
      '  if current == end: stop',
      '  for neighbor in neighbors(current)',
      '    relax g and update f',
      'reconstruct path from end',
    ],
  },
};
