import { describe, jest, test, beforeEach } from '@jest/globals';

class InvalidArgumentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidArgumentError';
  }
}

// setup mocks
jest.unstable_mockModule('commander', () => ({ InvalidArgumentError }));

// import after mocks set up
const { intParser } = await import('../../src/validation/validateArgs.js');

describe('validateArgs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('intParser', () => {
    test.each([null, undefined, '', false, true, {}, Promise.resolve(true)])(
      'throws if not parsable as int: %s',
      (value) => {
        expect(() => {
          intParser([1, 2, 3])(value);
        }).toThrow(InvalidArgumentError);
      }
    );

    test('throws if value is not a valid choice', () => {
      expect(() => {
        intParser([1, 2, 3])('4');
      }).toThrow(InvalidArgumentError);
    });

    test('returns integer if value is a valid choice', () => {
      const result = intParser([1, 2, 3])('1');
      expect(result).toBe(1);
    });
  });
});
