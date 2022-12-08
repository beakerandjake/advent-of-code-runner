import { describe, jest, test } from '@jest/globals';
import { getConfigValue as originalGetConfigValue } from '../src/config.js';

// setup getConfigValue so it can be mocked.
jest.unstable_mockModule('../src/config.js', () => ({
  getConfigValue: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version
const { getConfigValue } = await import('../src/config.js');
const { yearIsValid, dayIsValid, partIsValid } = await import('../src/validatePuzzle.js');

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
});

// test('false when current year is max year and not currently december', () => {
//   const maxYear = 1967;

//   jest.useFakeTimers().setSystemTime(new Date(1967, 4, 3));

//   overrideConfigValues([
//     ['aoc.puzzleValidation.minYear', 1945],
//     ['aoc.puzzleValidation.maxYear', maxYear],
//   ]);
//   expect(yearIsValid(maxYear)).toBe(false);

//   jest.useRealTimers();
// });

// test.each(commonFailCases)('yearIsValid - false on: %p', (value) => {
//   expect(yearIsValid(value)).toBe(false);
// });

// test('yearIsValid - false on before start year', () => {
//   const z = getConfigValue('logging');
//   console.log('z', z);
//   getConfigValue.mockImplementation(() => 'asdf');

//   const q = getConfigValue('logging');
//   console.log('q', q);

//   expect(yearIsValid(2003)).toBe(false);
// });

// test.todo('yearIsValid - RangeError on end year before start year');
// test.todo('yearIsValid - false in future');
// test.todo('yearIsValid - false in this year not december');
// test.todo('yearIsValid - true between min year and last year');
// test.todo('yearIsValid - true in this year and its december');

// test.each(commonFailCases)('dayIsValid - false on: %p', (value) => {
//   expect(dayIsValid(value)).toBe(false);
// });

// test.todo('dayIsValid - false on above max day');
// test.todo('dayIsValid - false on below min day');
// test.todo('dayIsValid - true when between min and max');

// test.each(commonFailCases)('partIsValid - false on: %p', (value) => {
//   expect(partIsValid(value)).toBe(false);
// });

// test.todo('partIsValid - false when below min part');
// test.todo('partIsValid - false when above max part');
