import { describe, test } from '@jest/globals';
import { get, has } from '../src/util';

describe('util', () => {
  describe('get()', () => {
    test('returns default value if no target', () => {
      expect(get(null, 'SADF')).toBe(undefined);
    });

    test('returns default value if no path', () => {
      expect(get({ cool: false }, null)).toBe(undefined);
      expect(get({ cool: false }, '')).toBe(undefined);
      expect(get({ cool: false }, undefined)).toBe(undefined);
    });

    test('returns default value if target is not object', () => {
      expect(get(false, 'asdf')).toBe(undefined);
      expect(get([], 'asdf')).toBe(undefined);
      expect(get(Promise.resolve(false), 'asdf')).toBe(undefined);
      expect(get(() => {}, 'asdf')).toBe(undefined);
    });

    test('returns undefined if key not found and no default provided', () => {
      expect(get({ qwer: 1234 }, 'asdf')).toBe(undefined);
    });

    test('returns default value if key not found (top level)', () => {
      expect(get({ qwer: 1234 }, 'asdf', true)).toBe(true);
    });

    test('returns default value if key not found (nested)', () => {
      expect(get({ qwer: 1234 }, 'one.two', true)).toBe(true);
    });

    test('returns value if key is found (top level)', () => {
      const expected = 22;
      const key = 'asdf';
      expect(get({ [key]: expected }, key)).toBe(expected);
    });

    test('returns value if key is found (nested)', () => {
      const expected = 22;
      expect(get({ one: { two: { three: { four: expected } } } }, 'one.two.three.four')).toBe(expected);
    });
  });

  describe('has()', () => {
    test('returns false if no target', () => {
      expect(has(null, 'asdf')).toBe(false);
      expect(has(undefined, 'asdf')).toBe(false);
    });

    test('returns false if not object', () => {
      expect(has([], 'asdf')).toBe(false);
      expect(has(Promise.resolve(true), 'asdf')).toBe(false);
      expect(has(() => {}, 'asdf')).toBe(false);
    });

    test('returns false if no key', () => {
      expect(has({ cool: false }, '')).toBe(false);
      expect(has({ cool: false }, null)).toBe(false);
      expect(has({ cool: false }, undefined)).toBe(false);
    });

    test('returns false if key not string', () => {
      expect(has({ cool: false }, false)).toBe(false);
      expect(has({ cool: false }, {})).toBe(false);
      expect(has({ cool: false }, [])).toBe(false);
    });

    test('returns false if target does not have key (top level)', () => {
      expect(has({ cool: false }, 'cats')).toBe(false);
    });

    test('returns false if target does not have key (nested)', () => {
      expect(has({ cool: { cats: { only: true } } }, 'cats')).toBe(false);
    });

    test('returns true if target has key (top level)', () => {
      expect(has({ cool: { cats: { only: true } } }, 'cool')).toBe(true);
    });

    test('returns true if target has key (nested)', () => {
      expect(has({ cool: { cats: { only: true } } }, 'cool.cats')).toBe(true);
    });
  });
});
