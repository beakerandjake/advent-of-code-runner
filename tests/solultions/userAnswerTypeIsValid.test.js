import { describe, test } from '@jest/globals';
import { userAnswerTypeIsValid } from '../../src/solutions/userAnswerTypeIsValid';

describe('userAnswerTypeIsValid', () => {
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
    [new class Cats {}(), false],
    [Promise.resolve(true), false],
  ])('"%s" returns "%s"', (value, expected) => {
    expect(userAnswerTypeIsValid(value)).toBe(expected);
  });
});
