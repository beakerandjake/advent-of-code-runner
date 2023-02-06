import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// set up mocks
mockLogger();

jest.unstable_mockModule('../../src/config.js', () => ({
  getConfigValue: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version
const { getConfigValue } = await import('../../src/config.js');
const { dayIsValid, levelIsValid, yearIsValid } = await import('../../src/validation/validateArgs.js');

afterEach(() => {
  jest.clearAllMocks();
});

describe('validateArgs', () => {
  describe('yearIsValid()', () => {
    test('true when year is valid', () => {
      const year = 2022;
      getConfigValue.mockReturnValue([1234, 9999, 2783, year, 3737]);
      expect(yearIsValid(year)).toBe(true);
    });

    test('false when year is not valid', () => {
      const year = 2022;
      getConfigValue.mockReturnValue([1234, 9999, 2783, 3737]);
      expect(yearIsValid(year)).toBe(false);
    });
  });

  describe('dayIsValid()', () => {
    test('true when day is valid', () => {
      const day = 16;
      getConfigValue.mockReturnValue([1, 2, 3, 4, day, 5, 6, 7]);
      expect(dayIsValid(day)).toBe(true);
    });

    test('false when day is not valid', () => {
      const day = 16;
      getConfigValue.mockReturnValue([1, 2, 3, 4, 5, 6, 7]);
      expect(dayIsValid(day)).toBe(false);
    });
  });

  describe('levelIsValid()', () => {
    test('true when level is valid', () => {
      const level = 16;
      getConfigValue.mockReturnValue([1, 2, 3, 4, level, 5, 6, 7]);
      expect(levelIsValid(level)).toBe(true);
    });

    test('false when level is not valid', () => {
      const level = 16;
      getConfigValue.mockReturnValue([1, 2, 3, 4, 5, 6, 7]);
      expect(levelIsValid(level)).toBe(false);
    });
  });
});
