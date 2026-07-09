import { useMemo, useState } from 'react';
import { ControlButton } from '../../../components/controls/ControlButton';
import { SliderControl } from '../../../components/controls/SliderControl';
import { SelectControl } from '../../../components/controls/SelectControl';
import { ExplanationPanel } from '../../../components/explanation/ExplanationPanel';
import { PseudocodePanel } from '../../../components/explanation/PseudocodePanel';
import { Legend } from '../../../components/visualization/Legend';
import { PlaybackControls } from '../../../components/layout/PlaybackControls';
import { speedToDelayMs, useAnimationController } from '../../../lib/animation/useAnimationController';
import { GRAPH_EXAMPLES } from '../algorithms/graphExamples';
import { generateTraversalSteps } from '../algorithms/traversalAlgorithms';
import type { GraphExample, TraversalMode, TraversalStep } from '../graphTypes';

const pseudocode = {
  bfs: ['queue.enqueue(start)', 'while queue is not empty', '  current = queue.dequeue()', '  visit current', '  for each neighbor', '    if unvisited: mark and enqueue'],
  dfs: ['stack.push(start)', 'while stack is not empty', '  current = stack.pop()', '  visit current', '  for each neighbor', '    if unvisited: push neighbor'],
};

export function GraphVisualizer() {
  const [exampleId, setExampleId] = useState(GRAPH_EXAMPLES[0].id);
  const [mode, setMode] = useState<TraversalMode>('bfs');
  const [startNode, setStartNode] = useState('A');
  const [speed, setSpeed] = useState(50);
  const graph = GRAPH_EXAMPLES.find((example) => example.id === exampleId) ?? GRAPH_EXAMPLES[0];

  const steps = useMemo(() => generateTraversalSteps(graph, startNode, mode), [graph, mode, startNode]);
  const controller = useAnimationController<TraversalStep>(steps, speedToDelayMs(speed));
  const current = controller.currentStep ?? steps[0];

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="grid gap-5">
        <div className="panel p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="control-label">Graph Traversal Visualizer</p>
              <h2 className="mt-1 text-2xl font-black heading-strong">BFS queue vs DFS stack</h2>
            </div>
            <PlaybackControls controller={controller} />
          </div>

          <div className="mt-5 grid gap-4 rounded-2xl surface-muted p-4 md:grid-cols-4">
            <SelectControl
              label="Graph"
              value={exampleId}
              onChange={(id) => {
                const next = GRAPH_EXAMPLES.find((item) => item.id === id) ?? GRAPH_EXAMPLES[0];
                setExampleId(next.id);
                setStartNode(next.nodes[0].id);
              }}
              options={GRAPH_EXAMPLES.map((item) => ({ value: item.id, label: item.label }))}
            />
            <SelectControl
              label="Traversal"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'bfs', label: 'Breadth-First Search' },
                { value: 'dfs', label: 'Depth-First Search' },
              ]}
            />
            <SelectControl
              label="Start node"
              value={startNode}
              onChange={setStartNode}
              options={graph.nodes.map((node) => ({ value: node.id, label: node.label }))}
            />
            <SliderControl label="Speed" min={1} max={100} suffix="%" value={speed} onChange={setSpeed} />
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Legend items={[{ label: 'Current', className: 'bg-indigo-600' }, { label: 'Frontier', className: 'bg-amber-400' }, { label: 'Visited', className: 'bg-sky-400' }, { label: 'Completed', className: 'bg-emerald-500' }]} />
            <div className="flex gap-2 text-xs font-semibold">
              <span className="pill">Frontier: {current.frontier.join(' → ') || 'empty'}</span>
              <span className="pill">Output: {current.output.join(', ') || 'none'}</span>
            </div>
          </div>
          <GraphCanvas graph={graph} step={current} />
        </div>
      </div>

      <ExplanationPanel
        content={{
          title: mode === 'bfs' ? 'Breadth-First Search' : 'Depth-First Search',
          currentStep: current.description,
          concept: mode === 'bfs'
            ? 'BFS explores level by level using a queue. It is ideal for shortest paths in unweighted graphs.'
            : 'DFS explores as far as possible down one branch using a stack, then backtracks.',
          timeComplexity: 'O(V + E)',
          spaceComplexity: 'O(V)',
          useCases: mode === 'bfs' ? ['Unweighted shortest path', 'Broadcast search', 'Web crawling by distance'] : ['Cycle detection', 'Topological sorting foundation', 'Backtracking problems'],
          edgeCases: ['Disconnected components', 'Cycles', 'Missing start node'],
        }}
      >
        <PseudocodePanel lines={pseudocode[mode]} activeLine={current.codeLine} />
        <ControlButton onClick={() => setStartNode(graph.nodes[Math.floor(Math.random() * graph.nodes.length)].id)}>Random start</ControlButton>
      </ExplanationPanel>
    </section>
  );
}

function GraphCanvas({ graph, step }: { graph: GraphExample; step: TraversalStep }) {
  const nodesById = Object.fromEntries(graph.nodes.map((node) => [node.id, node]));
  return (
    <svg viewBox="0 0 520 340" role="img" aria-label="Graph traversal canvas" className="canvas-surface h-[24rem] w-full">
      {graph.edges.map((edge) => {
        const from = nodesById[edge.from];
        const to = nodesById[edge.to];
        return <line key={`${edge.from}-${edge.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />;
      })}
      {graph.nodes.map((node) => {
        const isCurrent = step.currentNode === node.id;
        const isFrontier = step.frontier.includes(node.id);
        const isCompleted = step.completed.includes(node.id);
        const isVisited = step.visited.includes(node.id);
        const fill = isCurrent ? '#4f46e5' : isCompleted ? '#10b981' : isFrontier ? '#f59e0b' : isVisited ? '#38bdf8' : '#e2e8f0';
        const text = isCurrent || isCompleted || isFrontier ? '#ffffff' : '#0f172a';
        return (
          <g key={node.id} className="transition-all">
            <circle cx={node.x} cy={node.y} r="30" fill={fill} stroke="#ffffff" strokeWidth="5" />
            <text x={node.x} y={node.y + 6} textAnchor="middle" fontSize="18" fontWeight="800" fill={text}>{node.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
