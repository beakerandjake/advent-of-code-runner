import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/persistence/userDataFile.js', () => ({ getValue: jest.fn() }));
jest.unstable_mockModule('src/validation/index.js', () => ({ yearIsValid: jest.fn() }));

// import after mocks set up
const { getValue } = await import('../../src/persistence/userDataFile.js');
const { yearIsValid } = await import('../../src/validation/index.js');
const { getYear } = await import('../../src/actions/links/getYear.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('links', () => {
    describe('getYear()', () => {
      test('throws if not valid', async () => {
        getValue.mockReturnValue(1988);
        yearIsValid.mockReturnValue(false);
        await expect(async () => getYear()).rejects.toThrow(RangeError);
      });

      test('returns year', async () => {
        const year = 2022;
        getValue.mockReturnValue(year);
        yearIsValid.mockReturnValue(true);
        const result = await getYear();
        expect(result).toEqual({ year });
      });
    });
  });
});
