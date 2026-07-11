import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { HeapVisualizer } from '../heap/components/HeapVisualizer';
import { GraphVisualizer } from '../graph/components/GraphVisualizer';
import { PathfindingVisualizer } from '../pathfinding/components/PathfindingVisualizer';

describe('heap min/max modes', () => {
  it('renders in min-heap mode by default', () => {
    render(<HeapVisualizer />);
    expect(screen.getByRole('heading', { name: /min-heap tree and backing array/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /min-heap/i })).toHaveAttribute('aria-checked', 'true');
  });

  it('switches to max-heap mode', async () => {
    const user = userEvent.setup();
    render(<HeapVisualizer />);
    await user.click(screen.getByRole('radio', { name: /max-heap/i }));
    expect(screen.getByRole('heading', { name: /max-heap tree and backing array/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /max-heap/i })).toHaveAttribute('aria-checked', 'true');
  });
});

describe('graph traversal controls', () => {
  it('exposes a start-node selector with an option per node', () => {
    render(<GraphVisualizer />);
    const startSelect = screen.getByRole('combobox', { name: /start node/i });
    const options = within(startSelect).getAllByRole('option');
    expect(options.length).toBeGreaterThanOrEqual(4);
  });

  it('lets the user pick a different start node', async () => {
    const user = userEvent.setup();
    render(<GraphVisualizer />);
    const startSelect = screen.getByRole('combobox', { name: /start node/i });
    const options = within(startSelect).getAllByRole<HTMLOptionElement>('option');
    const target = options[options.length - 1].value;
    await user.selectOptions(startSelect, target);
    expect((startSelect as HTMLSelectElement).value).toBe(target);
  });
});

describe('pathfinding controls coexist', () => {
  it('renders the algorithm selector, brush group, and speed slider together', () => {
    render(<PathfindingVisualizer />);
    expect(screen.getByRole('combobox', { name: /algorithm/i })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: /brush/i })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /speed/i })).toBeInTheDocument();
  });

  it('supports selecting each pathfinding algorithm', async () => {
    const user = userEvent.setup();
    render(<PathfindingVisualizer />);
    const algo = screen.getByRole('combobox', { name: /algorithm/i }) as HTMLSelectElement;
    await user.selectOptions(algo, 'dijkstra');
    expect(algo.value).toBe('dijkstra');
    await user.selectOptions(algo, 'bfs');
    expect(algo.value).toBe('bfs');
  });
});
