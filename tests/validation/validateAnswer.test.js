import { describe, test } from '@jest/globals';
import { answerTypeIsValid } from '../../src/validation/validateAnswer.js';

describe('validateAnswer', () => {
  describe('answerTypeIsValid()', () => {
    test.each([
      [null, false],
      [undefined, false],
      ['ASDF', true],
      [1234, true],
      [1234.324, true],
      [Infinity, false],
      [BigInt(22), false],
      [NaN, false],
      [false, false],
      [true, false],
      [{}, false],
      [[], false],
      [() => {}, false],
      [new (class Cats {})(), false],
      [Promise.resolve(true), false],
    ])('"%s" returns "%s"', (value, expected) => {
      expect(answerTypeIsValid(value)).toBe(expected);
    });
  });
});
