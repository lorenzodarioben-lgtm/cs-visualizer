/* This is a static catalogue module, not a component module. */
import type { ReactNode } from 'react';
import {
  ChartBar,
  Circuitry,
  GridFour,
  LinkSimpleHorizontal,
  ShareNetwork,
  TreeStructure,
} from '@phosphor-icons/react';

export type VisualizerKey =
  | 'sorting'
  | 'graph'
  | 'pathfinding'
  | 'heap'
  | 'linked-list'
  | 'state-machine';

export type VisualizerMeta = {
  key: VisualizerKey;
  label: string;
  description: string;
  icon: ReactNode;
};

const ICON_SIZE = 19;

/** Single source of truth for the visualizer catalogue (nav order, labels, icons). */
export const VISUALIZERS: VisualizerMeta[] = [
  {
    key: 'sorting',
    label: 'Sorting',
    description: 'Bubble, selection, insertion, merge, quick',
    icon: <ChartBar size={ICON_SIZE} weight="bold" />,
  },
  {
    key: 'graph',
    label: 'Graph',
    description: 'BFS and DFS traversal',
    icon: <ShareNetwork size={ICON_SIZE} weight="bold" />,
  },
  {
    key: 'pathfinding',
    label: 'Pathfinding',
    description: 'Grid BFS, Dijkstra, and A*',
    icon: <GridFour size={ICON_SIZE} weight="bold" />,
  },
  {
    key: 'heap',
    label: 'Heap',
    description: 'Min-heap and max-heap operations',
    icon: <TreeStructure size={ICON_SIZE} weight="bold" />,
  },
  {
    key: 'linked-list',
    label: 'Linked List',
    description: 'Pointers and node operations',
    icon: <LinkSimpleHorizontal size={ICON_SIZE} weight="bold" />,
  },
  {
    key: 'state-machine',
    label: 'State Machine',
    description: 'Turnstile finite automaton',
    icon: <Circuitry size={ICON_SIZE} weight="bold" />,
  },
];

export const VISUALIZER_KEYS: VisualizerKey[] = VISUALIZERS.map((item) => item.key);

export function isVisualizerKey(value: unknown): value is VisualizerKey {
  return typeof value === 'string' && (VISUALIZER_KEYS as string[]).includes(value);
}
