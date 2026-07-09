import { useTheme } from './lib/theme/useTheme';
import { useLocalStorage } from './lib/utils/useLocalStorage';
import { AppShell } from './components/layout/AppShell';
import { SortingVisualizer } from './features/sorting/components/SortingVisualizer';
import { GraphVisualizer } from './features/graph/components/GraphVisualizer';
import { HeapVisualizer } from './features/heap/components/HeapVisualizer';
import { LinkedListVisualizer } from './features/linked-list/components/LinkedListVisualizer';
import { StateMachineVisualizer } from './features/state-machine/components/StateMachineVisualizer';
import { PathfindingVisualizer } from './features/pathfinding/components/PathfindingVisualizer';

export type VisualizerKey =
  | 'sorting'
  | 'graph'
  | 'pathfinding'
  | 'heap'
  | 'linked-list'
  | 'state-machine';

const VISUALIZER_KEYS: VisualizerKey[] = [
  'sorting',
  'graph',
  'pathfinding',
  'heap',
  'linked-list',
  'state-machine',
];

function isVisualizerKey(value: unknown): value is VisualizerKey {
  return typeof value === 'string' && (VISUALIZER_KEYS as string[]).includes(value);
}

export default function App() {
  const [active, setActive] = useLocalStorage<VisualizerKey>(
    'cs-visualizer:active',
    'sorting',
    isVisualizerKey,
  );
  const { theme, toggleTheme } = useTheme();

  return (
    <AppShell active={active} onChange={setActive} theme={theme} onToggleTheme={toggleTheme}>
      {active === 'sorting' && <SortingVisualizer />}
      {active === 'graph' && <GraphVisualizer />}
      {active === 'pathfinding' && <PathfindingVisualizer />}
      {active === 'heap' && <HeapVisualizer />}
      {active === 'linked-list' && <LinkedListVisualizer />}
      {active === 'state-machine' && <StateMachineVisualizer />}
    </AppShell>
  );
}
