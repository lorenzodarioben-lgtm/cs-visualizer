export type TraversalMode = 'bfs' | 'dfs';

export type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
};

export type GraphEdge = {
  from: string;
  to: string;
};

export type GraphExample = {
  id: string;
  label: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type TraversalStep = {
  id: string;
  mode: TraversalMode;
  description: string;
  codeLine?: number;
  currentNode?: string;
  visited: string[];
  completed: string[];
  frontier: string[];
  output: string[];
  warning?: string;
};
