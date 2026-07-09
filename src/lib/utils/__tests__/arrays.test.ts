import { describe, expect, it } from 'vitest';
import { clampNumber, cloneArray, numbersEqual, parseNumberList, swap } from '../arrays';

describe('parseNumberList', () => {
  it('parses comma-separated numbers', () => {
    expect(parseNumberList('3, 1, 2')).toEqual([3, 1, 2]);
  });

  it('accepts whitespace and mixed separators', () => {
    expect(parseNumberList('4  8\t15,16 23')).toEqual([4, 8, 15, 16, 23]);
  });

  it('drops non-numeric tokens and handles negatives/decimals', () => {
    expect(parseNumberList('5, x, -3, 2.5, foo')).toEqual([5, -3, 2.5]);
  });

  it('returns an empty array for empty or blank input', () => {
    expect(parseNumberList('')).toEqual([]);
    expect(parseNumberList('   ')).toEqual([]);
  });
});

describe('clampNumber', () => {
  it('clamps below, within, and above the range', () => {
    expect(clampNumber(-5, 1, 100)).toBe(1);
    expect(clampNumber(50, 1, 100)).toBe(50);
    expect(clampNumber(250, 1, 100)).toBe(100);
  });
});

describe('array helpers', () => {
  it('swaps two indices in place', () => {
    const items = [1, 2, 3];
    swap(items, 0, 2);
    expect(items).toEqual([3, 2, 1]);
  });

  it('clones without sharing a reference', () => {
    const original = [1, 2, 3];
    const copy = cloneArray(original);
    expect(copy).toEqual(original);
    expect(copy).not.toBe(original);
  });

  it('compares numeric arrays by value', () => {
    expect(numbersEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(numbersEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(numbersEqual([1, 2, 3], [1, 9, 3])).toBe(false);
  });
});
