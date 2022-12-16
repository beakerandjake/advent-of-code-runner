import { describe, jest, test } from '@jest/globals';
import { getConfigValue as originalGetConfigValue } from '../src/config.js';

// setup getConfigValue so it can be mocked.
jest.unstable_mockModule('../src/config.js', () => ({
  getConfigValue: jest.fn(),
}));

// mock the logger
jest.unstable_mockModule('../src/logger.js', () => ({
  logger: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version
const { getConfigValue } = await import('../src/config.js');
const {
  yearIsValid, dayIsValid, partIsValid, getAllPuzzles,
} = await import('../src/validatePuzzle.js');

// since some tests override the mock implementation, we have to reset it before each test.
beforeEach(() => getConfigValue.mockImplementation(originalGetConfigValue));

// allows specific config keys to be overwritten with mock values.
const overrideConfigValues = (overrides) => {
  getConfigValue.mockImplementation((key) => {
    const override = overrides.find((x) => x[0] === key);

    if (!override) {
      return originalGetConfigValue(key);
    }

    return override[1];
  });
};

const commonFailCases = [
  null,
  undefined,
  '',
  Infinity,
  'Cats!',
  true,
  [],
  Promise.resolve(1),
  new Error(),
  () => 1,
  1.205,
  '3',
];

describe('validatePuzzle', () => {
  describe('yearIsValid()', () => {
    test.each(commonFailCases)('false when non-integer: %p', (value) => {
      expect(yearIsValid(value)).toBe(false);
    });

    test('false when after max year', () => {
      overrideConfigValues([
        ['aoc.puzzleValidation.years', [1990, 2000, 2001]],
      ]);
      expect(yearIsValid(2024)).toBe(false);
    });

    test('true when equal to max year', () => {
      overrideConfigValues([
        ['aoc.puzzleValidation.years', [1990, 2000, 2001]],
      ]);
      expect(yearIsValid(2001)).toBe(true);
    });

    test('false when before min year', () => {
      overrideConfigValues([
        ['aoc.puzzleValidation.years', [1967, 1968, 1969]],
      ]);
      expect(yearIsValid(1922)).toBe(false);
    });

    test('true when equal to min year', () => {
      overrideConfigValues([
        ['aoc.puzzleValidation.years', [2022, 2023, 2024]],

      ]);
      expect(yearIsValid(2022)).toBe(true);
    });

    test('true when year is between min year and max year', () => {
      overrideConfigValues([
        ['aoc.puzzleValidation.years', [2022, 2023, 2024]],

      ]);
      expect(yearIsValid(2023)).toBe(true);
    });
  });

  describe('dayIsValid()', () => {
    test.each(commonFailCases)('false when non-integer: %p', (value) => {
      expect(dayIsValid(value)).toBe(false);
    });

    test('false when before min day', () => {
      const minDay = 18;
      overrideConfigValues([
        ['aoc.puzzleValidation.days', [minDay, 19, 20, 21]],
      ]);
      expect(dayIsValid(minDay - 1)).toBe(false);
    });

    test('true when equal to min day', () => {
      const minDay = 18;
      overrideConfigValues([
        ['aoc.puzzleValidation.days', [minDay, 19, 20, 21]],

      ]);
      expect(dayIsValid(minDay)).toBe(true);
    });

    test('false when after max day', () => {
      const maxDay = 21;
      overrideConfigValues([
        ['aoc.puzzleValidation.days', [18, 19, 20, maxDay]],
      ]);
      expect(dayIsValid(maxDay + 1)).toBe(false);
    });

    test('true when equal to max day', () => {
      const maxDay = 21;
      overrideConfigValues([
        ['aoc.puzzleValidation.days', [18, 19, 20, maxDay]],
      ]);
      expect(dayIsValid(maxDay)).toBe(true);
    });

    test('true when between min day and max day', () => {
      overrideConfigValues([
        ['aoc.puzzleValidation.days', [18, 19, 20]],

      ]);
      expect(dayIsValid(19)).toBe(true);
    });
  });

  describe('partIsValid()', () => {
    test.each(commonFailCases)('false when non-integer: %p', (value) => {
      expect(partIsValid(value)).toBe(false);
    });

    test('false when part is not included in valid parts', () => {
      overrideConfigValues([
        ['aoc.puzzleValidation.parts', [6, 7, 8]],
      ]);
      expect(partIsValid(22)).toBe(false);
    });

    test('true when equal to min part', () => {
      overrideConfigValues([
        ['aoc.puzzleValidation.parts', [6, 7, 8]],
      ]);
      expect(partIsValid(6)).toBe(true);
    });

    test('true when equal to max part', () => {
      overrideConfigValues([
        ['aoc.puzzleValidation.parts', [6, 7, 8]],
      ]);
      expect(partIsValid(8)).toBe(true);
    });
  });

  describe('getAllPuzzles()', () => {
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

      expect(getAllPuzzles(year)).toStrictEqual(expected);
    });
  });
});
