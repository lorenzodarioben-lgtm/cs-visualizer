import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SortingVisualizer } from '../components/SortingVisualizer';

/** The bars are the only elements with an inline height style inside the canvas. */
function getBars(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>('div[style*="height"]'));
}

describe('SortingVisualizer rendering', () => {
  it('renders one bar per array value on first load', () => {
    const { container } = render(<SortingVisualizer />);
    const bars = getBars(container);
    // Default array size is 18.
    expect(bars).toHaveLength(18);
  });

  it('gives every bar a positive percentage height (regression: bars collapsed to 0)', () => {
    const { container } = render(<SortingVisualizer />);
    for (const bar of getBars(container)) {
      const height = bar.style.height;
      expect(height).toMatch(/%$/);
      expect(Number.parseFloat(height)).toBeGreaterThan(0);
    }
  });

  it('renders each bar inside a full-height column so percentage heights can resolve', () => {
    const { container } = render(<SortingVisualizer />);
    // The regression was a 0-height flex column; the column must stretch to the row height.
    const column = getBars(container)[0].parentElement;
    expect(column?.className).toContain('h-full');
  });

  it('keeps bars rendered after changing the algorithm', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortingVisualizer />);
    const select = screen.getByRole('combobox', { name: /algorithm/i });
    await user.selectOptions(select, 'quick');
    expect(getBars(container).length).toBeGreaterThan(0);
    await user.selectOptions(select, 'merge');
    expect(getBars(container).length).toBeGreaterThan(0);
  });

  it('applies a valid custom array and renders the matching number of bars', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortingVisualizer />);
    const input = screen.getByLabelText(/custom array values/i);
    await user.clear(input);
    await user.type(input, '5, 3, 8, 1');
    await user.click(screen.getByRole('button', { name: /use my array/i }));
    expect(getBars(container)).toHaveLength(4);
  });

  it('shows a bounded step counter', () => {
    render(<SortingVisualizer />);
    const counter = screen.getByText(/Step \d+ \/ \d+/);
    const [, current, total] = counter.textContent!.match(/Step (\d+) \/ (\d+)/)!;
    expect(Number(current)).toBeGreaterThanOrEqual(1);
    expect(Number(current)).toBeLessThanOrEqual(Number(total));
    expect(Number(total)).toBeGreaterThan(1);
  });
});
