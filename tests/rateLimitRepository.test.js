import {
  describe, jest, test, afterEach,
} from '@jest/globals';

// setup mocks.
jest.unstable_mockModule('../src/persistence/jsonFileStore.js', () => ({
  getStoreValue: jest.fn(),
  setStoreValue: jest.fn(),
}));

// jest.unstable_mockModule('date-fns', () => ({
//   isValid: jest.fn(),
//   parseISO: jest.fn(),
// }));

// import after setting up the mock so the modules import the mocked version
// const { isValid, parseISO } = await import('date-fns');
const { getStoreValue, setStoreValue } = await import('../src/persistence/jsonFileStore.js');
const { getRateLimit, setRateLimit } = await import('../src/persistence/rateLimitRepository.js');

afterEach(() => {
  jest.clearAllMocks();
});

describe('rateLimitRepository', () => {
  describe('getRateLimit()', () => {
    test('no stored data, returns null', async () => {
      getStoreValue.mockReturnValueOnce({});
      expect(await getRateLimit('ASDF')).toBe(null);
    });

    test('no date for action type, returns null', async () => {
      const key = 'cool';
      getStoreValue.mockReturnValueOnce({ notCool: '1234' });
      expect(await getRateLimit(key)).toBe(null);
    });

    test('empty date for action type, returns null', async () => {
      const key = 'cool';
      getStoreValue.mockReturnValueOnce({ [key]: null });
      expect(await getRateLimit(key)).toEqual(null);
    });

    test('value date for action type, returns date', async () => {
      const expected = new Date();
      const key = 'cool';
      getStoreValue.mockReturnValueOnce({ [key]: expected.toISOString() });
      expect(await getRateLimit(key)).toEqual(expected);
    });

    test('invalid date for action type, throws', async () => {
      const key = 'cool';
      getStoreValue.mockReturnValueOnce({ [key]: 'really not a date!' });
      expect(async () => getRateLimit(key)).rejects.toThrow();
    });
  });

  describe('setRateLimit()', () => {
    test('adds if doesn\'t exist', async () => {

    });

    test('updates if exists', async () => {

    });
  });
});
