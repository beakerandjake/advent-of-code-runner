import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { CachedValue } from '../src/persistence/cachedValue.js';

describe('cachedValue', () => {
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
