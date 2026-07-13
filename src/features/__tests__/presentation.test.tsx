import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../../App';
import { GraphVisualizer } from '../graph/components/GraphVisualizer';

describe('navigation presentation', () => {
  it('renders every visualizer nav entry with an icon', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: /visualizers/i });
    const buttons = within(nav).getAllByRole('button');
    expect(buttons).toHaveLength(6);
    for (const button of buttons) {
      expect(button.querySelector('svg')).not.toBeNull();
    }
  });

  it('marks the active nav entry with aria-current', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: /visualizers/i });
    const current = within(nav)
      .getAllByRole('button')
      .filter((button) => button.getAttribute('aria-current') === 'page');
    expect(current).toHaveLength(1);
  });
});

describe('graph theming', () => {
  it('draws nodes with theme-aware fill classes rather than fixed colours', () => {
    const { container } = render(<GraphVisualizer />);
    const circles = [...container.querySelectorAll('circle')];
    expect(circles.length).toBeGreaterThan(0);
    for (const circle of circles) {
      // Fill is driven by a Tailwind class so it adapts to light/dark, not a baked hex attribute.
      expect(circle.getAttribute('class') ?? '').toMatch(/fill-/);
      expect(circle.getAttribute('fill')).toBeNull();
    }
  });
});
