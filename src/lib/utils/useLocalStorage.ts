import { useCallback, useEffect, useState } from 'react';

/**
 * A useState-like hook that persists its value to localStorage under `key`.
 * Falls back to `initialValue` when storage is empty or unavailable (SSR,
 * privacy mode). An optional `validate` guard rejects stale/corrupt values.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate?: (value: unknown) => value is T,
): [T, (value: T) => void] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      const parsed = JSON.parse(raw) as unknown;
      if (validate && !validate(parsed)) return initialValue;
      return parsed as T;
    } catch {
      return initialValue;
    }
  }, [initialValue, key, validate]);

  const [value, setValue] = useState<T>(readValue);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore write failures (quota, privacy mode) */
    }
  }, [key, value]);

  const set = useCallback((next: T) => setValue(next), []);

  return [value, set];
}
