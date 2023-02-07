import { describe, test } from '@jest/globals';
import { parsePositiveInt } from '../../src/validation/validationUtils.js';

describe('validationUtils', () => {
  describe('parsePositiveInt()', () => {
    test.each([
      false,
      true,
      {},
      () => {},
      Promise.resolve(1234),
      'NOTANUMBER',
      '@2#$',
      NaN,
      Infinity, 
      -Infinity,
      1/0
    ])('throws if non-numeric value: %s', (value) => {
      expect(() => parsePositiveInt(value)).toThrow(TypeError);
    });

    test('parses numeric string', () => {
      expect(parsePositiveInt('1234')).toBe(1234);
    });

    test('parses number', () => {
      expect(parsePositiveInt(1234)).toBe(1234);
    });

    test('throws on negative number', () => {
      expect(() => parsePositiveInt(-1234)).toThrow(RangeError);
    });

    test('throws on negative numeric string', () => {
      expect(() => parsePositiveInt('-1234')).toThrow(RangeError);
    });
  });
});
