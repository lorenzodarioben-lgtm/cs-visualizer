import type { GraphExample } from '../graphTypes';

export const GRAPH_EXAMPLES: GraphExample[] = [
  {
    id: 'teaching-tree',
    label: 'Teaching graph',
    nodes: [
      { id: 'A', label: 'A', x: 260, y: 50 },
      { id: 'B', label: 'B', x: 140, y: 145 },
      { id: 'C', label: 'C', x: 380, y: 145 },
      { id: 'D', label: 'D', x: 80, y: 255 },
      { id: 'E', label: 'E', x: 205, y: 255 },
      { id: 'F', label: 'F', x: 380, y: 255 },
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'B', to: 'E' },
      { from: 'C', to: 'F' },
    ],
  },
  {
    id: 'cycle',
    label: 'Cyclic graph',
    nodes: [
      { id: 'A', label: 'A', x: 260, y: 45 },
      { id: 'B', label: 'B', x: 430, y: 130 },
      { id: 'C', label: 'C', x: 365, y: 285 },
      { id: 'D', label: 'D', x: 155, y: 285 },
      { id: 'E', label: 'E', x: 90, y: 130 },
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'E' },
      { from: 'E', to: 'A' },
      { from: 'B', to: 'D' },
    ],
  },
  {
    id: 'disconnected',
    label: 'Disconnected graph',
    nodes: [
      { id: 'A', label: 'A', x: 120, y: 90 },
      { id: 'B', label: 'B', x: 230, y: 170 },
      { id: 'C', label: 'C', x: 95, y: 250 },
      { id: 'X', label: 'X', x: 405, y: 90 },
      { id: 'Y', label: 'Y', x: 455, y: 230 },
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'X', to: 'Y' },
    ],
  },
];
