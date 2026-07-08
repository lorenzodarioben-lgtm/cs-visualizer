import { describe, expect, it } from 'vitest';
import { GRAPH_EXAMPLES } from '../algorithms/graphExamples';
import { finalTraversalOrder, generateTraversalSteps } from '../algorithms/traversalAlgorithms';

const graph = GRAPH_EXAMPLES[0];
const disconnected = GRAPH_EXAMPLES[2];

describe('graph traversal step generators', () => {
  it('BFS returns expected traversal order on a known graph', () => {
    expect(finalTraversalOrder(generateTraversalSteps(graph, 'A', 'bfs'))).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
  });

  it('DFS returns expected traversal order on a known graph', () => {
    expect(finalTraversalOrder(generateTraversalSteps(graph, 'A', 'dfs'))).toEqual(['A', 'B', 'D', 'E', 'C', 'F']);
  });

  it('traversal handles disconnected nodes by staying in the reachable component', () => {
    expect(finalTraversalOrder(generateTraversalSteps(disconnected, 'A', 'bfs'))).toEqual(['A', 'B', 'C']);
    expect(finalTraversalOrder(generateTraversalSteps(disconnected, 'X', 'dfs'))).toEqual(['X', 'Y']);
  });

  it('traversal handles missing start node gracefully', () => {
    const steps = generateTraversalSteps(graph, 'Z', 'bfs');
    expect(steps.at(-1)?.warning).toBe('Missing start node');
    expect(finalTraversalOrder(steps)).toEqual([]);
  });
});
