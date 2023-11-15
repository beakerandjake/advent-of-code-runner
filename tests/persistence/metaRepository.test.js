import { describe, jest, test, afterEach } from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';
import { AuthTokenNotFoundError } from '../../src/errors/cliErrors.js';

// setup mocks
mockLogger();
const { getConfigValue } = mockConfig();
jest.unstable_mockModule('src/persistence/userDataFile.js', () => ({
  getValue: jest.fn(),
}));

// import after mocks set up
const { getValue } = await import('../../src/persistence/userDataFile.js');
const { getYear, getAuthToken } = await import(
  '../../src/persistence/metaRepository.js'
);

describe('metaRepository()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getYear()', () => {
    test('throws if year is not valid', async () => {
      const validYear = 1988;
      getValue.mockImplementation(async (key) => {
        if (key === 'year') {
          return validYear;
        }
        throw new Error(`unknown key: ${key}`);
      });
      getConfigValue.mockImplementation((key) => {
        if (key === 'aoc.validation.years') {
          return [1922, 1945, 2022];
        }
        throw new Error(`unknown key: ${key}`);
      });
      await expect(async () => getYear()).rejects.toThrow(RangeError);
    });

    test('returns year if valid', async () => {
      const validYear = 1988;
      getValue.mockImplementation(async (key) => {
        if (key === 'year') {
          return validYear;
        }
        throw new Error(`unknown key: ${key}`);
      });
      getConfigValue.mockImplementation((key) => {
        if (key === 'aoc.validation.years') {
          return [1922, 1945, 2022, validYear];
        }
        throw new Error(`unknown key: ${key}`);
      });
      const result = await getYear();
      await expect(result).toBe(validYear);
    });
  });

  describe('getAuthToken()', () => {
    test('returns expected value', () => {
      const expected = 'COOL';
      getConfigValue.mockImplementation((key) => {
        if (key === 'aoc.authenticationToken') {
          return expected;
        }
        throw new Error('unknown key');
      });
      const result = getAuthToken();
      expect(result).toBe(expected);
    });

    test.each([null, undefined, ''])('throws if token is %s', (value) => {
      getConfigValue.mockImplementation((key) => {
        if (key === 'aoc.authenticationToken') {
          return value;
        }
        throw new Error('unknown key');
      });
      expect(() => getAuthToken()).toThrow(AuthTokenNotFoundError);
    });
  });
});
