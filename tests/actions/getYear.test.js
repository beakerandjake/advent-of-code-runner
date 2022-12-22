import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/config.js', () => ({ getConfigValue: jest.fn() }));
jest.unstable_mockModule('src/validation/index.js', () => ({ yearIsValid: jest.fn() }));

// import after mocks set up
const { getConfigValue } = await import('../../src/config.js');
const { yearIsValid } = await import('../../src/validation/index.js');
const { getYear } = await import('../../src/actions/common/getYear.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actionUtil', () => {
  describe('getYear()', () => {
    test('throws if not valid', () => {
      yearIsValid.mockReturnValue(false);
      expect(() => getYear()).toThrow(RangeError);
    });

    test('appends year to empty args', () => {
      const year = 2022;
      getConfigValue.mockReturnValue(year);
      yearIsValid.mockReturnValue(true);
      expect(getYear()).toEqual({ year });
    });

    test('appends year to existing args', () => {
      const existing = { cats: true, dogs: false };
      const year = 2022;
      getConfigValue.mockReturnValue(year);
      yearIsValid.mockReturnValue(true);
      expect(getYear(existing)).toEqual({ ...existing, year });
    });
  });
});
