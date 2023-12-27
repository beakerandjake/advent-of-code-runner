import { describe, jest, test, beforeEach } from '@jest/globals';
import { InvalidArgumentError } from 'commander';
import { mockConfig } from './mocks.js';

// setup mocks
const { getConfigValue } = mockConfig();

// import after mocks set up
const { intParser, decorateName, getDayArg, getLevelArg } = await import(
  '../src/arguments.js'
);

describe('arguments', () => {
  beforeEach(() => {
    jest.resetAllMocks();
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

  describe('decorateName()', () => {
    test('wraps with angle brackets if required is true', () => {
      const name = 'COOLNAME';
      const result = decorateName(name, true);
      expect(result).toBe(`<${name}>`);
    });
    test('wraps with square brackets if required is false', () => {
      const name = 'COOLNAME';
      const result = decorateName(name, false);
      expect(result).toBe(`[${name}]`);
    });
  });

  describe('getDayArg()', () => {
    test('arg is required if required is true', () => {
      const arg = getDayArg(true);
      expect(arg.required).toBe(true);
    });

    test('arg is optional if required is false', () => {
      const arg = getDayArg(false);
      expect(arg.required).toBe(false);
    });

    test('parseArg() throws if day not valid', () => {
      getConfigValue.mockImplementation((key) => {
        switch (key) {
          case 'aoc.validation.days':
            return [1, 2, 3];
          default:
            throw new Error(`unknown key: ${key}`);
        }
      });
      const arg = getDayArg(false);
      expect(() => arg.parseArg(4)).toThrow(InvalidArgumentError);
    });

    test('parseArg() returns number if day is valid', () => {
      getConfigValue.mockImplementation((key) => {
        switch (key) {
          case 'aoc.validation.days':
            return [1, 2, 3];
          default:
            throw new Error(`unknown key: ${key}`);
        }
      });
      const arg = getDayArg(false);
      const result = arg.parseArg('2');
      expect(result).toBe(2);
    });
  });

  describe('getLevelArg()', () => {
    test('arg is required if required is true', () => {
      const result = getLevelArg(true);
      expect(result.required).toBe(true);
    });

    test('arg is optional if required is false', () => {
      const result = getLevelArg(false);
      expect(result.required).toBe(false);
    });

    test('parseArg() throws if level not valid', () => {
      getConfigValue.mockImplementation((key) => {
        switch (key) {
          case 'aoc.validation.levels':
            return [10, 20];
          default:
            throw new Error(`unknown key: ${key}`);
        }
      });
      const arg = getLevelArg(false);
      expect(() => arg.parseArg(4)).toThrow(InvalidArgumentError);
    });

    test('parseArg() returns number if day is valid', () => {
      getConfigValue.mockImplementation((key) => {
        switch (key) {
          case 'aoc.validation.levels':
            return [10, 20];
          default:
            throw new Error(`unknown key: ${key}`);
        }
      });
      const arg = getLevelArg(false);
      const result = arg.parseArg('20');
      expect(result).toBe(20);
    });
  });
});
