import { describe, test } from '@jest/globals';
import { inputIsValid } from '../../src/validation/validateInput.js';

describe('validateInput', () => {
  describe('inputIsValid()', () => {
    test.each([
      null,
      undefined,
      1234,
      1234.324,
      Infinity,
      BigInt(22),
      NaN,
      false,
      true,
      {},
      [],
      () => {},
      new (class Cats {})(),
      Promise.resolve(true),
    ])('returns false on non string value "%s"', (value) => {
      const result = inputIsValid(value);
      expect(inputIsValid(result)).toBe(false);
    });

    ['', ' ', '\t', '\r\n', '\n'].forEach((value) =>
      test(`returns false on empty string value ${JSON.stringify(
        value
      )}`, () => {
        const result = inputIsValid(value);
        expect(result).toBe(false);
      })
    );

    test('returns true on non empty string', () => {
      const result = inputIsValid('CATS');
      expect(result).toBe(true);
    });

    test('returns true on non empty string with line breaks', () => {
      const result = inputIsValid('CATS\nCATS2');
      expect(result).toBe(true);
    });
  });
});
