/* This is a static catalogue module, not a component module. */
/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';

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

/** Single source of truth for the visualizer catalogue (nav order, labels, icons). */
export const VISUALIZERS: VisualizerMeta[] = [
  {
    key: 'sorting',
    label: 'Sorting',
    description: 'Bubble, selection, insertion, merge, quick',
    icon: <Glyph d="M4 18V8M9 18v-6M14 18V4M19 18v-9" />,
  },
  {
    key: 'graph',
    label: 'Graph',
    description: 'BFS and DFS traversal',
    icon: (
      <Glyph>
        <circle cx="6" cy="6" r="2.4" />
        <circle cx="18" cy="7" r="2.4" />
        <circle cx="12" cy="18" r="2.4" />
        <path d="M7.6 7.6 10.7 16M16.6 8.8 13.3 16M8 6.4h8" fill="none" />
      </Glyph>
    ),
  },
  {
    key: 'pathfinding',
    label: 'Pathfinding',
    description: 'Grid BFS, Dijkstra, and A*',
    icon: (
      <Glyph>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" fill="none" />
      </Glyph>
    ),
  },
  {
    key: 'heap',
    label: 'Heap',
    description: 'Min-heap operations',
    icon: (
      <Glyph>
        <circle cx="12" cy="5" r="2.2" />
        <circle cx="6" cy="14" r="2.2" />
        <circle cx="18" cy="14" r="2.2" />
        <path d="M10.4 6.4 7.4 12.4M13.6 6.4l3 6" fill="none" />
      </Glyph>
    ),
  },
  {
    key: 'linked-list',
    label: 'Linked List',
    description: 'Pointers and node operations',
    icon: (
      <Glyph>
        <rect x="3" y="9" width="6" height="6" rx="1.5" />
        <rect x="15" y="9" width="6" height="6" rx="1.5" />
        <path d="M9 12h6M13 10l2 2-2 2" fill="none" />
      </Glyph>
    ),
  },
  {
    key: 'state-machine',
    label: 'State Machine',
    description: 'Turnstile finite automaton',
    icon: (
      <Glyph>
        <circle cx="7" cy="12" r="3" />
        <circle cx="17" cy="12" r="3" />
        <path d="M10 11c2-2 2-2 4 0M14 13c-2 2-2 2-4 0" fill="none" />
      </Glyph>
    ),
  },
];

export const VISUALIZER_KEYS: VisualizerKey[] = VISUALIZERS.map((item) => item.key);

export function isVisualizerKey(value: unknown): value is VisualizerKey {
  return typeof value === 'string' && (VISUALIZER_KEYS as string[]).includes(value);
}

function Glyph({ d, children }: { d?: string; children?: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {d ? <path d={d} /> : children}
    </svg>
  );
}
