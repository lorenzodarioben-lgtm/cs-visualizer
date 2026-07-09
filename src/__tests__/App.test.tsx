import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../App';

afterEach(() => window.localStorage.clear());

describe('App smoke test', () => {
  it('renders the hero and all six visualizers in the nav', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /CS Visualizer/i })).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: /visualizers/i });
    for (const label of ['Sorting', 'Graph', 'Pathfinding', 'Heap', 'Linked List', 'State Machine']) {
      expect(within(nav).getByRole('button', { name: new RegExp(label, 'i') })).toBeInTheDocument();
    }
  });

  it('defaults to the sorting visualizer', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Compare, swap, partition, merge/i })).toBeInTheDocument();
  });

  it('switches to the pathfinding visualizer when its nav card is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    const nav = screen.getByRole('navigation', { name: /visualizers/i });
    await user.click(within(nav).getByRole('button', { name: /Pathfinding/i }));
    expect(screen.getByRole('heading', { name: /Grid search on walls and weights/i })).toBeInTheDocument();
    expect(window.localStorage.getItem('cs-visualizer:active')).toBe(JSON.stringify('pathfinding'));
  });

  it('exposes an accessible theme toggle', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /switch to (dark|light) theme/i })).toBeInTheDocument();
  });
});
