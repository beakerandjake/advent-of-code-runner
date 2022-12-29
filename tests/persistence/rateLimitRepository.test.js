import {
  describe, jest, test, afterEach,
} from '@jest/globals';

// setup mocks.
jest.unstable_mockModule('fs-extra/esm', () => ({
  readJson: jest.fn(),
  outputJson: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version
const { readJson, outputJson } = await import('fs-extra/esm');
const { getRateLimit, setRateLimit } = await import('../../src/persistence/rateLimitRepository.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('rateLimitRepository', () => {
  describe('getRateLimit()', () => {
    test('no file, returns null', async () => {
      const error = new Error('file not found');
      error.code = 'ENOENT';
      readJson.mockRejectedValue(error);
      const result = await getRateLimit('ASDF');
      expect(result).toBe(null);
    });

    test('no stored data, returns null', async () => {
      readJson.mockResolvedValue({});
      const result = await getRateLimit('ASDF');
      expect(result).toBe(null);
    });

    test('no date for action type, returns null', async () => {
      readJson.mockResolvedValue({ notCool: '1234' });
      const result = await getRateLimit('cool');
      expect(result).toBe(null);
    });

    test('empty date for action type, returns null', async () => {
      const key = 'cool';
      readJson.mockResolvedValue({ [key]: null });
      const result = await getRateLimit(key);
      expect(result).toBe(null);
    });

    test('value date for action type, returns date', async () => {
      const expected = new Date();
      const key = 'cool';
      readJson.mockResolvedValue({ [key]: expected.toISOString() });
      const result = await getRateLimit(key);
      expect(result).toEqual(expected);
    });

    test('invalid date for action type, throws', async () => {
      const key = 'cool';
      readJson.mockResolvedValueOnce({ [key]: 'really not a date!' });
      await expect(async () => getRateLimit(key)).rejects.toThrow(TypeError);
    });
  });

  // describe('setRateLimit()', () => {
  //   test.each([
  //     null,
  //     undefined,
  //     Promise.resolve(new Date()),
  //     true,
  //     1234,
  //     '12/01/2022',
  //     {},
  //     new Date(Infinity),
  //   ])('throws on invalid date value: "%s"', async (value) => {
  //     expect(async () => setRateLimit('asdf', value)).rejects.toThrow(TypeError);
  //   });

  //   // test('throws on null/undefined expiration', () => {
  //   //   expect(async () => setRateLimit('asdf', null)).rejects.toThrow(TypeError);
  //   //   expect(async () => setRateLimit('asdf', undefined)).rejects.toThrow(TypeError);
  //   // });

  //   // test('throws on expiration is not a date ', () => {
  //   //   expect(async () => setRateLimit('asdf', Promise.resolve(new Date()))).rejects.toThrow(TypeError);
  //   //   expect(async () => setRateLimit('asdf', true)).rejects.toThrow(TypeError);
  //   //   expect(async () => setRateLimit('asdf', 1234234)).rejects.toThrow(TypeError);
  //   //   expect(async () => setRateLimit('asdf', '12/01/2022')).rejects.toThrow(TypeError);
  //   //   expect(async () => setRateLimit('asdf', {})).rejects.toThrow(TypeError);
  //   // });

  //   // test('throws on expiration is invalid date', () => {
  //   //   expect(async () => setRateLimit('asdf', new Date(Infinity))).rejects.toThrow(TypeError);
  //   // });

  //   test('adds if didn\'t exist', async () => {
  //     const key = 'cool';
  //     const value = new Date(2022, 11, 4);
  //     const orig = { notCool: new Date().toISOString() };
  //     getValue.mockResolvedValueOnce({ notCool: new Date().toISOString() });
  //     await setRateLimit(key, value);
  //     expect(setValue).toHaveBeenCalledWith(
  //       expect.any(String),
  //       { ...orig, [key]: value.toISOString() },
  //     );
  //   });

  //   test('updates if already exists', async () => {
  //     const key = 'cool';
  //     const value = new Date(2022, 11, 4);
  //     const orig = { notCool: new Date().toISOString(), [key]: value.toISOString() };
  //     getValue.mockResolvedValueOnce({ notCool: new Date().toISOString() });
  //     await setRateLimit(key, value);
  //     expect(setValue).toHaveBeenCalledWith(
  //       expect.any(String),
  //       { ...orig, [key]: value.toISOString() },
  //     );
  //   });
  // });
});
