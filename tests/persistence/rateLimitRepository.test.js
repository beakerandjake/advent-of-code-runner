import {
  describe, jest, test, afterEach,
} from '@jest/globals';

// setup mocks.
jest.unstable_mockModule('../../src/persistence/jsonFileStore.js', () => ({
  getValue: jest.fn(),
  setStoreValue: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version
const { getValue, setStoreValue } = await import('../../src/persistence/jsonFileStore.js');
const { getRateLimit, setRateLimit } = await import('../../src/persistence/rateLimitRepository.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('rateLimitRepository', () => {
  describe('getRateLimit()', () => {
    test('no stored data, returns null', async () => {
      getValue.mockResolvedValueOnce({});
      expect(await getRateLimit('ASDF')).toBe(null);
    });

    test('no date for action type, returns null', async () => {
      const key = 'cool';
      getValue.mockResolvedValueOnce({ notCool: '1234' });
      expect(await getRateLimit(key)).toBe(null);
    });

    test('empty date for action type, returns null', async () => {
      const key = 'cool';
      getValue.mockResolvedValueOnce({ [key]: null });
      expect(await getRateLimit(key)).toEqual(null);
    });

    test('value date for action type, returns date', async () => {
      const expected = new Date();
      const key = 'cool';
      getValue.mockResolvedValueOnce({ [key]: expected.toISOString() });
      expect(await getRateLimit(key)).toEqual(expected);
    });

    test('invalid date for action type, throws', async () => {
      const key = 'cool';
      getValue.mockResolvedValueOnce({ [key]: 'really not a date!' });
      expect(async () => getRateLimit(key)).rejects.toThrow(TypeError);
    });
  });

  describe('setRateLimit()', () => {
    test.each([
      null,
      undefined,
      Promise.resolve(new Date()),
      true,
      1234,
      '12/01/2022',
      {},
      new Date(Infinity),
    ])('throws on invalid date value: "%s"', async (value) => {
      expect(async () => setRateLimit('asdf', value)).rejects.toThrow(TypeError);
    });

    // test('throws on null/undefined expiration', () => {
    //   expect(async () => setRateLimit('asdf', null)).rejects.toThrow(TypeError);
    //   expect(async () => setRateLimit('asdf', undefined)).rejects.toThrow(TypeError);
    // });

    // test('throws on expiration is not a date ', () => {
    //   expect(async () => setRateLimit('asdf', Promise.resolve(new Date()))).rejects.toThrow(TypeError);
    //   expect(async () => setRateLimit('asdf', true)).rejects.toThrow(TypeError);
    //   expect(async () => setRateLimit('asdf', 1234234)).rejects.toThrow(TypeError);
    //   expect(async () => setRateLimit('asdf', '12/01/2022')).rejects.toThrow(TypeError);
    //   expect(async () => setRateLimit('asdf', {})).rejects.toThrow(TypeError);
    // });

    // test('throws on expiration is invalid date', () => {
    //   expect(async () => setRateLimit('asdf', new Date(Infinity))).rejects.toThrow(TypeError);
    // });

    test('adds if didn\'t exist', async () => {
      const key = 'cool';
      const value = new Date(2022, 11, 4);
      const orig = { notCool: new Date().toISOString() };
      getValue.mockResolvedValueOnce({ notCool: new Date().toISOString() });
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
      getValue.mockResolvedValueOnce({ notCool: new Date().toISOString() });
      await setRateLimit(key, value);
      expect(setStoreValue).toHaveBeenCalledWith(
        expect.any(String),
        { ...orig, [key]: value.toISOString() },
      );
    });
  });
});
