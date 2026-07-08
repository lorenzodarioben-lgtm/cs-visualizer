import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { SortingVisualizer } from './features/sorting/components/SortingVisualizer';
import { GraphVisualizer } from './features/graph/components/GraphVisualizer';
import { HeapVisualizer } from './features/heap/components/HeapVisualizer';
import { LinkedListVisualizer } from './features/linked-list/components/LinkedListVisualizer';
import { StateMachineVisualizer } from './features/state-machine/components/StateMachineVisualizer';

export type VisualizerKey = 'sorting' | 'graph' | 'heap' | 'linked-list' | 'state-machine';

export default function App() {
  const [active, setActive] = useState<VisualizerKey>('sorting');

  return (
    <AppShell active={active} onChange={setActive}>
      {active === 'sorting' && <SortingVisualizer />}
      {active === 'graph' && <GraphVisualizer />}
      {active === 'heap' && <HeapVisualizer />}
      {active === 'linked-list' && <LinkedListVisualizer />}
      {active === 'state-machine' && <StateMachineVisualizer />}
    </AppShell>
  );
}
