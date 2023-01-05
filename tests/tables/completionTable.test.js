import { describe, test } from '@jest/globals';
import {
  getPuzzleColumnText, getTableTitle, getSolvedColumnText, getNumberOfAttemptsColumnText,
} from '../../src/tables/completionTable.js';

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

  describe('getNumberOfAttemptsColumnText()', () => {
    test.each([
      null, undefined, '',
    ])('returns empty string if provided: "%s" (no max)', (numberOfAttempts) => {
      const result = getNumberOfAttemptsColumnText(numberOfAttempts);
      expect(result).toBe('');
    });

    test.each([
      null, undefined, '',
    ])('returns empty string if provided: "%s" (with max)', (numberOfAttempts) => {
      const result = getNumberOfAttemptsColumnText(numberOfAttempts, 1234);
      expect(result).toBe('');
    });

    test('returns value if no max', () => {
      const input = 1234;
      const result = getNumberOfAttemptsColumnText(input);
      expect(result).toBe(input.toString());
    });

    test('returns value if max, and value is not equal to max', () => {
      const input = 1234;
      const result = getNumberOfAttemptsColumnText(input, input + 1);
      expect(result).toBe(input.toString());
    });

    test('informs of worst if value is equal to max', () => {
      const input = 1234;
      const result = getNumberOfAttemptsColumnText(input, input);
      expect(result).toContain(input.toString());
      expect(result).toContain('worst');
    });
  });
});
