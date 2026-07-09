import { useTheme } from './lib/theme/useTheme';
import { useLocalStorage } from './lib/utils/useLocalStorage';
import { AppShell } from './components/layout/AppShell';
import { SortingVisualizer } from './features/sorting/components/SortingVisualizer';
import { GraphVisualizer } from './features/graph/components/GraphVisualizer';
import { HeapVisualizer } from './features/heap/components/HeapVisualizer';
import { LinkedListVisualizer } from './features/linked-list/components/LinkedListVisualizer';
import { StateMachineVisualizer } from './features/state-machine/components/StateMachineVisualizer';
import { PathfindingVisualizer } from './features/pathfinding/components/PathfindingVisualizer';
import { isVisualizerKey } from './features/visualizers';
import type { VisualizerKey } from './features/visualizers';

export type { VisualizerKey } from './features/visualizers';

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
