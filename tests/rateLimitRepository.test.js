import {
  describe, jest, test, afterEach,
} from '@jest/globals';

// setup mocks.
jest.unstable_mockModule('../src/persistence/jsonFileStore.js', () => ({
  getStoreValue: jest.fn(),
  setStoreValue: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version
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
    test('throws on null/undefined expiration', () => {
      expect(async () => setRateLimit('asdf', null)).rejects.toThrow();
      expect(async () => setRateLimit('asdf', undefined)).rejects.toThrow();
    });

    test('throws on expiration is not a date ', () => {
      expect(async () => setRateLimit('asdf', Promise.resolve(new Date()))).rejects.toThrow();
      expect(async () => setRateLimit('asdf', true)).rejects.toThrow();
      expect(async () => setRateLimit('asdf', 1234234)).rejects.toThrow();
      expect(async () => setRateLimit('asdf', '12/01/2022')).rejects.toThrow();
      expect(async () => setRateLimit('asdf', {})).rejects.toThrow();
    });

    test('throws on expiration is invalid date', () => {
      expect(async () => setRateLimit('asdf', new Date(Infinity))).rejects.toThrow();
    });

    test('adds if didn\'t exist', async () => {
      const key = 'cool';
      const value = new Date(2022, 11, 4);
      const orig = { notCool: new Date().toISOString() };
      getStoreValue.mockReturnValueOnce({ notCool: new Date().toISOString() });
      await setRateLimit(key, value);
      expect(setStoreValue).toHaveBeenCalledWith(
        expect.any(String),
        { ...orig, [key]: value.toISOString() },
      );
    });

    test('updates if already exists', async () => {
      const key = 'cool';
      const value = new Date(2022, 11, 4);
      const orig = { notCool: new Date().toISOString(), [key]: value.toISOString() };
      getStoreValue.mockReturnValueOnce({ notCool: new Date().toISOString() });
      await setRateLimit(key, value);
      expect(setStoreValue).toHaveBeenCalledWith(
        expect.any(String),
        { ...orig, [key]: value.toISOString() },
      );
    });
  });
});
