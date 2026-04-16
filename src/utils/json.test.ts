import { describe, expect, it } from 'vitest';

import { getEntries, isExpandable, maxDepth, nodeCount } from 'utils/json';

describe('isExpandable', () => {
  it('returns false for null', () => {
    expect(isExpandable(null)).toBe(false);
  });

  it('returns false for a boolean', () => {
    expect(isExpandable(true)).toBe(false);
    expect(isExpandable(false)).toBe(false);
  });

  it('returns false for a number', () => {
    expect(isExpandable(42)).toBe(false);
  });

  it('returns false for a string', () => {
    expect(isExpandable('hello')).toBe(false);
  });

  it('returns true for an empty array', () => {
    expect(isExpandable([])).toBe(true);
  });

  it('returns true for a non-empty array', () => {
    expect(isExpandable([1, 2, 3])).toBe(true);
  });

  it('returns true for an empty object', () => {
    expect(isExpandable({})).toBe(true);
  });

  it('returns true for a non-empty object', () => {
    expect(isExpandable({ a: 1 })).toBe(true);
  });
});

describe('getEntries', () => {
  it('maps array items to [index, value, false] tuples', () => {
    expect(getEntries(['a', 'b', 'c'])).toEqual([
      ['0', 'a', false],
      ['1', 'b', false],
      ['2', 'c', false],
    ]);
  });

  it('returns an empty array for an empty array', () => {
    expect(getEntries([])).toEqual([]);
  });

  it('maps object entries to [key, value, true] tuples', () => {
    expect(getEntries({ x: 1, y: 2 })).toEqual([
      ['x', 1, true],
      ['y', 2, true],
    ]);
  });

  it('returns an empty array for an empty object', () => {
    expect(getEntries({})).toEqual([]);
  });

  it('uses string indices for array items', () => {
    const entries = getEntries([42]);
    expect(entries[0][0]).toBe('0');
  });

  it('handles nested values without unwrapping them', () => {
    expect(getEntries({ a: [1, 2] })).toEqual([['a', [1, 2], true]]);
  });
});

describe('nodeCount', () => {
  it('counts a null as 1', () => {
    expect(nodeCount(null)).toBe(1);
  });

  it('counts a boolean as 1', () => {
    expect(nodeCount(true)).toBe(1);
    expect(nodeCount(false)).toBe(1);
  });

  it('counts a number as 1', () => {
    expect(nodeCount(42)).toBe(1);
  });

  it('counts a string as 1', () => {
    expect(nodeCount('hello')).toBe(1);
  });

  it('counts an empty array as 1', () => {
    expect(nodeCount([])).toBe(1);
  });

  it('counts a flat array as 1 plus each element', () => {
    expect(nodeCount([1, 2, 3])).toBe(4);
  });

  it('counts an empty object as 1', () => {
    expect(nodeCount({})).toBe(1);
  });

  it('counts a flat object as 1 plus each value', () => {
    expect(nodeCount({ a: 1, b: 2 })).toBe(3);
  });

  it('counts nested objects recursively', () => {
    expect(nodeCount({ a: { b: { c: 1 } } })).toBe(4);
  });

  it('counts nested arrays recursively', () => {
    expect(nodeCount([[1, 2], [3]])).toBe(6);
  });

  it('counts a mixed nested structure', () => {
    expect(nodeCount({ users: [{ name: 'Alice' }, { name: 'Bob' }] })).toBe(6);
  });
});

describe('maxDepth', () => {
  it('returns 0 for null', () => {
    expect(maxDepth(null)).toBe(0);
  });

  it('returns 0 for a boolean', () => {
    expect(maxDepth(true)).toBe(0);
  });

  it('returns 0 for a number', () => {
    expect(maxDepth(0)).toBe(0);
  });

  it('returns 0 for a string', () => {
    expect(maxDepth('hi')).toBe(0);
  });

  it('returns 1 for an empty array', () => {
    expect(maxDepth([])).toBe(1);
  });

  it('returns 1 for a flat array of primitives', () => {
    expect(maxDepth([1, 2, 3])).toBe(1);
  });

  it('returns 1 for an empty object', () => {
    expect(maxDepth({})).toBe(1);
  });

  it('returns 1 for a flat object with primitive values', () => {
    expect(maxDepth({ a: 1, b: 'x' })).toBe(1);
  });

  it('returns 2 for one level of nesting in an object', () => {
    expect(maxDepth({ a: { b: 1 } })).toBe(2);
  });

  it('returns 2 for one level of nesting in an array', () => {
    expect(maxDepth([[1, 2]])).toBe(2);
  });

  it('uses the deepest branch when depths differ', () => {
    expect(maxDepth({ a: 1, b: { c: { d: 1 } } })).toBe(3);
  });

  it('returns the correct depth for a mixed nested structure', () => {
    expect(maxDepth({ users: [{ name: 'Alice' }] })).toBe(3);
  });
});
