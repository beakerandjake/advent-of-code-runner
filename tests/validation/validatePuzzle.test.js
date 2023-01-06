import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// set up mocks
mockLogger();
const { getConfigValue } = mockConfig();

// import after setting up the mock so the modules import the mocked version
const { getAllPuzzlesForYear, puzzleIsInFuture, getTotalPuzzleCount } = await import('../../src/validation/validatePuzzle.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('validatePuzzle', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('puzzleIsInFuture()', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    test('returns false - year in past', () => {
      jest.setSystemTime(new Date(2022, 11, 3));
      const result = puzzleIsInFuture(2019, 5);
      expect(result).toBe(false);
    });

    test('returns true - year in future', () => {
      jest.setSystemTime(new Date(2022, 11, 3));
      const result = puzzleIsInFuture(2045, 5);
      expect(result).toBe(true);
    });

    test('returns false - same year, day in past', () => {
      jest.setSystemTime(new Date(2022, 11, 16));
      const result = puzzleIsInFuture(2022, 1);
      expect(result).toBe(false);
    });

    test('returns true - same year, day in future', () => {
      jest.setSystemTime(new Date(2022, 11, 16));
      const result = puzzleIsInFuture(2022, 18);
      expect(result).toBe(true);
    });

    // test literally every minute from midnight until unlock time.
    [...Array(60 * 19).keys()].forEach((minutes) => {
      const year = 2022;
      const day = 22;
      const utcMidnightMs = new Date(year, 11, day).setUTCHours(0, 0, 0, 0);
      const systemTime = new Date(utcMidnightMs + minutes * 60000);

      test(`returns false - same day time is: ${systemTime.toISOString()}`, () => {
        jest.setSystemTime(systemTime);
        expect(puzzleIsInFuture(year, day)).toBe(true);
      });
    });

    // test literally every minute from unlock time until midnight.
    [...Array(60 * 5).keys()].forEach((minutes) => {
      const year = 2022;
      const day = 22;
      const utcUnlockTimeMs = new Date(year, 11, day).setUTCHours(19, 0, 0, 0);
      const systemTime = new Date(utcUnlockTimeMs + minutes * 60000);

      test(`returns false - same day time is: ${systemTime.toISOString()}`, () => {
        jest.setSystemTime(systemTime);
        expect(puzzleIsInFuture(year, day)).toBe(false);
      });
    });
  });

  describe('getAllPuzzlesForYear()', () => {
    test('returns expected value', () => {
      const year = 2022;
      getConfigValue.mockReturnValueOnce([1, 2, 3, 4, 5]);
      getConfigValue.mockReturnValueOnce([1, 2, 3]);
      const expected = [
        { year, day: 1, part: 1 },
        { year, day: 1, part: 2 },
        { year, day: 1, part: 3 },
        { year, day: 2, part: 1 },
        { year, day: 2, part: 2 },
        { year, day: 2, part: 3 },
        { year, day: 3, part: 1 },
        { year, day: 3, part: 2 },
        { year, day: 3, part: 3 },
        { year, day: 4, part: 1 },
        { year, day: 4, part: 2 },
        { year, day: 4, part: 3 },
        { year, day: 5, part: 1 },
        { year, day: 5, part: 2 },
        { year, day: 5, part: 3 },
      ];

      expect(getAllPuzzlesForYear(year)).toStrictEqual(expected);
    });
  });

  describe('getTotalPuzzleCount()', () => {
    test('calculates correctly', () => {
      const days = 5;
      const parts = 10;
      getConfigValue.mockImplementation((key) => {
        if (key === 'aoc.validation.days') {
          return days;
        }
        if (key === 'aoc.validation.parts') {
          return parts;
        }
        throw new Error('unexpected getConfigValue call in test');
      });
      const result = getTotalPuzzleCount();
      expect(result).toBe(days * parts);
    });
  });
});
