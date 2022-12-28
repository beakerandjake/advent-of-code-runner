import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/persistence/jsonFileStore.js', () => ({ getStoreValue: jest.fn() }));
jest.unstable_mockModule('src/validation/index.js', () => ({ yearIsValid: jest.fn() }));

// import after mocks set up
const { getStoreValue } = await import('../../src/persistence/jsonFileStore.js');
const { yearIsValid } = await import('../../src/validation/index.js');
const { getYear } = await import('../../src/actions/links/getYear.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('links', () => {
    describe('getYear()', () => {
      test('throws if not valid', async () => {
        getStoreValue.mockReturnValue(1988);
        yearIsValid.mockReturnValue(false);
        await expect(async () => getYear()).rejects.toThrow(RangeError);
      });

      test('returns year', async () => {
        const year = 2022;
        getStoreValue.mockReturnValue(year);
        yearIsValid.mockReturnValue(true);
        const result = await getYear();
        expect(result).toEqual({ year });
      });
    });
  });
});
