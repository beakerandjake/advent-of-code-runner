import { describe, test } from '@jest/globals';
import { CachedValue } from '../src/persistence/cachedValue.js';

describe('cachedValue', () => {
  describe('value', () => {
    test('returns null if not set', () => {
      const cache = new CachedValue();
      expect(cache.value).toEqual(null);
    });

    test('returns default value if not set', () => {
      const expected = 22;
      const cache = new CachedValue(expected);
      expect(cache.value).toEqual(expected);
    });

    test('returns value if set', () => {
      const expected = 22;
      const cache = new CachedValue();
      cache.setValue(expected);
      expect(cache.value).toEqual(expected);
    });

    test('returns latest value if set multiple times', () => {
      const expected = 22;
      const cache = new CachedValue();
      cache.setValue(10);
      cache.setValue(expected);
      expect(cache.value).toEqual(expected);
    });
  });

  describe('hasValue()', () => {
    test('returns false if cache is not set', () => {
      const cache = new CachedValue();
      expect(cache.hasValue()).toEqual(false);
    });

    test('returns true if cache is set', () => {
      const cache = new CachedValue();
      cache.setValue(10);
      expect(cache.hasValue()).toEqual(true);
    });
  });

  describe('setValue()', () => {
    test('value equals set value', () => {
      const cache = new CachedValue();
      const value = 'COOL';
      cache.setValue(value);
      expect(cache.value).toEqual(value);
    });
  });
});
