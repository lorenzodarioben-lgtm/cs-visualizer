import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { speedToDelayMs, useAnimationController } from '../useAnimationController';

const steps = ['a', 'b', 'c', 'd'];

describe('useAnimationController', () => {
  it('starts at the first step', () => {
    const { result } = renderHook(() => useAnimationController(steps, 100));
    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.currentStep).toBe('a');
    expect(result.current.totalSteps).toBe(4);
    expect(result.current.canGoBack).toBe(false);
    expect(result.current.canGoForward).toBe(true);
  });

  it('steps forward and backward within bounds', () => {
    const { result } = renderHook(() => useAnimationController(steps, 100));
    act(() => result.current.next());
    expect(result.current.currentStepIndex).toBe(1);
    act(() => result.current.previous());
    act(() => result.current.previous());
    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.canGoBack).toBe(false);
  });

  it('does not advance past the last step', () => {
    const { result } = renderHook(() => useAnimationController(steps, 100));
    act(() => result.current.setStepIndex(99));
    expect(result.current.currentStepIndex).toBe(3);
    expect(result.current.canGoForward).toBe(false);
    act(() => result.current.next());
    expect(result.current.currentStepIndex).toBe(3);
  });

  it('reports a normalized progress value', () => {
    const { result } = renderHook(() => useAnimationController(steps, 100));
    act(() => result.current.setStepIndex(3));
    expect(result.current.progress).toBe(1);
    act(() => result.current.setStepIndex(0));
    expect(result.current.progress).toBe(0);
  });

  it('toggles loop mode', () => {
    const { result } = renderHook(() => useAnimationController(steps, 100));
    expect(result.current.loop).toBe(false);
    act(() => result.current.toggleLoop());
    expect(result.current.loop).toBe(true);
  });

  it('resets when the steps array changes identity', () => {
    const { result, rerender } = renderHook(({ data }) => useAnimationController(data, 100), {
      initialProps: { data: steps },
    });
    act(() => result.current.setStepIndex(2));
    expect(result.current.currentStepIndex).toBe(2);
    rerender({ data: ['x', 'y'] });
    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.totalSteps).toBe(2);
  });
});

describe('speedToDelayMs', () => {
  it('maps a higher speed to a shorter delay and never below the floor', () => {
    expect(speedToDelayMs(1)).toBeGreaterThan(speedToDelayMs(100));
    expect(speedToDelayMs(100)).toBeGreaterThanOrEqual(80);
  });
});
