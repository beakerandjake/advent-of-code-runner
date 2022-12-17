import { describe, test } from '@jest/globals';
import { get } from '../src/util';

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
});
