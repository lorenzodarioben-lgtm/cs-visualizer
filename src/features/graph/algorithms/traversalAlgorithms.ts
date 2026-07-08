import { nextStepId, resetStepIdCounter } from '../../../lib/utils/id';
import type { GraphExample, TraversalMode, TraversalStep } from '../graphTypes';

function adjacencyList(graph: GraphExample): Record<string, string[]> {
  const adjacency: Record<string, string[]> = Object.fromEntries(graph.nodes.map((node) => [node.id, []]));
  for (const edge of graph.edges) {
    adjacency[edge.from]?.push(edge.to);
    adjacency[edge.to]?.push(edge.from);
  }
  for (const key of Object.keys(adjacency)) {
    adjacency[key].sort();
  }
  return adjacency;
}

function step(
  mode: TraversalMode,
  description: string,
  data: Omit<TraversalStep, 'id' | 'mode' | 'description'>,
): TraversalStep {
  return {
    id: nextStepId(mode),
    mode,
    description,
    ...data,
    visited: [...data.visited],
    completed: [...data.completed],
    frontier: [...data.frontier],
    output: [...data.output],
  };
}

export function generateTraversalSteps(graph: GraphExample, startNode: string, mode: TraversalMode): TraversalStep[] {
  resetStepIdCounter();
  const nodes = new Set(graph.nodes.map((node) => node.id));
  if (!nodes.has(startNode)) {
    return [
      step(mode, `Start node ${startNode} does not exist in this graph.`, {
        visited: [],
        completed: [],
        frontier: [],
        output: [],
        warning: 'Missing start node',
        codeLine: 1,
      }),
    ];
  }

  return mode === 'bfs' ? bfsSteps(graph, startNode) : dfsSteps(graph, startNode);
}

export function finalTraversalOrder(steps: TraversalStep[]): string[] {
  return steps.at(-1)?.output ?? [];
}

function bfsSteps(graph: GraphExample, startNode: string): TraversalStep[] {
  const adjacency = adjacencyList(graph);
  const visited = new Set<string>([startNode]);
  const completed = new Set<string>();
  const queue = [startNode];
  const output: string[] = [];
  const steps: TraversalStep[] = [
    step('bfs', `Add ${startNode} to the queue and mark it visited.`, {
      currentNode: startNode,
      visited: [...visited],
      completed: [],
      frontier: [...queue],
      output,
      codeLine: 1,
    }),
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;
    output.push(current);
    steps.push(
      step('bfs', `Dequeue ${current}; it becomes the current node.`, {
        currentNode: current,
        visited: [...visited],
        completed: [...completed],
        frontier: [...queue],
        output,
        codeLine: 3,
      }),
    );

    for (const neighbor of adjacency[current]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        steps.push(
          step('bfs', `Discover ${neighbor} from ${current}; enqueue it for later.`, {
            currentNode: current,
            visited: [...visited],
            completed: [...completed],
            frontier: [...queue],
            output,
            codeLine: 6,
          }),
        );
      }
    }
    completed.add(current);
    steps.push(
      step('bfs', `All neighbors of ${current} have been considered.`, {
        currentNode: current,
        visited: [...visited],
        completed: [...completed],
        frontier: [...queue],
        output,
        codeLine: 2,
      }),
    );
  }

  return steps;
}

function dfsSteps(graph: GraphExample, startNode: string): TraversalStep[] {
  const adjacency = adjacencyList(graph);
  const visited = new Set<string>();
  const completed = new Set<string>();
  const stack = [startNode];
  const output: string[] = [];
  const steps: TraversalStep[] = [
    step('dfs', `Push ${startNode} onto the stack.`, {
      currentNode: startNode,
      visited: [],
      completed: [],
      frontier: [...stack],
      output,
      codeLine: 1,
    }),
  ];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (visited.has(current)) continue;

    visited.add(current);
    output.push(current);
    steps.push(
      step('dfs', `Pop ${current}; visit it now.`, {
        currentNode: current,
        visited: [...visited],
        completed: [...completed],
        frontier: [...stack],
        output,
        codeLine: 3,
      }),
    );

    const neighbors = [...adjacency[current]].reverse();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        steps.push(
          step('dfs', `Push unvisited neighbor ${neighbor} onto the stack.`, {
            currentNode: current,
            visited: [...visited],
            completed: [...completed],
            frontier: [...stack],
            output,
            codeLine: 6,
          }),
        );
      }
    }

    completed.add(current);
    steps.push(
      step('dfs', `${current} is complete; DFS will backtrack using the stack.`, {
        currentNode: current,
        visited: [...visited],
        completed: [...completed],
        frontier: [...stack],
        output,
        codeLine: 2,
      }),
    );
  }

  return steps;
}
