import { useState } from 'react';
import { useTheme } from './lib/theme/useTheme';
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

export default function App() {
  const [active, setActive] = useState<VisualizerKey>('sorting');
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
