import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useLocalStorage } from '../useLocalStorage';

afterEach(() => window.localStorage.clear());

describe('useLocalStorage', () => {
  it('returns the initial value when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('k1', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('persists updates to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('k2', 0));
    act(() => result.current[1](42));
    expect(result.current[0]).toBe(42);
    expect(JSON.parse(window.localStorage.getItem('k2')!)).toBe(42);
  });

  it('reads a previously stored value on mount', () => {
    window.localStorage.setItem('k3', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('k3', 'fallback'));
    expect(result.current[0]).toBe('stored');
  });

  it('falls back when a validation guard rejects the stored value', () => {
    window.localStorage.setItem('k4', JSON.stringify('bogus'));
    const isAllowed = (value: unknown): value is 'a' | 'b' => value === 'a' || value === 'b';
    const { result } = renderHook(() => useLocalStorage<'a' | 'b'>('k4', 'a', isAllowed));
    expect(result.current[0]).toBe('a');
  });

  it('falls back on corrupt JSON', () => {
    window.localStorage.setItem('k5', '{not valid json');
    const { result } = renderHook(() => useLocalStorage('k5', 'safe'));
    expect(result.current[0]).toBe('safe');
  });
});
