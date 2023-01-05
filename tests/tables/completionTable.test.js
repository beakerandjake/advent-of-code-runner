import { describe, test } from '@jest/globals';
import { getPuzzleColumnText, getTableTitle, getSolvedColumnText } from '../../src/tables/completionTable.js';

describe('completionTable', () => {
  describe('getTableTitle()', () => {
    test.each([
      null, undefined, '',
    ])('throws if year is: "%s"', (year) => {
      expect(() => getTableTitle(year)).toThrow();
    });

    test('returns a string value', () => {
      // not going to test the contents of the string, because that could change.
      const result = getTableTitle(2000);
      expect(typeof result).toBe('string');
    });
  });

  describe('getPuzzleColumnText()', () => {
    test.each([
      [null, null],
      [null, 1],
      [1, null],
      [undefined, undefined],
      [undefined, 1],
      [1, undefined],
    ])('throws if day is: "%s" and part is: "%s"', (day, part) => {
      expect(() => getPuzzleColumnText(day, part)).toThrow();
    });

    test('returns a string value', () => {
      // not going to test the contents of the string, because that could change.
      const result = getPuzzleColumnText(1, 2);
      expect(typeof result).toBe('string');
    });
  });

  describe('getSolvedColumnText()', () => {
    test('returns empty string if not solved', () => {
      // not going to test the contents of the string, because that could change.
      const result = getSolvedColumnText(false);
      expect(result).toBe('');
    });

    test('returns non empty string if not solved', () => {
      // not going to test the contents of the string, because that could change.
      const result = getSolvedColumnText(true);
      expect(result).not.toBe('');
      expect(typeof result).toBe('string');
    });
  });
});
