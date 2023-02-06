import { describe, jest, test, afterEach } from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks';

// setup mocks.
mockLogger();
mockConfig();
jest.unstable_mockModule('src/api/index.js', () => ({
  downloadInput: jest.fn(),
}));
jest.unstable_mockModule('src/inputs/inputCache.js', () => ({
  inputIsCached: jest.fn(),
  getCachedInput: jest.fn(),
  cacheInput: jest.fn(),
}));
jest.unstable_mockModule('src/validation/validateInput.js', () => ({
  inputIsValid: jest.fn(),
}));
jest.unstable_mockModule('src/actions/getAuthenticationToken.js', () => ({
  getAuthenticationToken: jest.fn(),
}));

// import mocks after setting up mocks
const { downloadInput } = await import('../../src/api/index.js');
const { inputIsCached, getCachedInput, cacheInput } = await import(
  '../../src/inputs/inputCache.js'
);
const { inputIsValid } = await import('../../src/validation/validateInput.js');
const { getAuthenticationToken } = await import(
  '../../src/actions/getAuthenticationToken.js'
);
const { getPuzzleInput } = await import('../../src/actions/getPuzzleInput.js');

describe('getPuzzleInput()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('input is cached', () => {
    test('returns cached value', async () => {
      const input = 'ASDF';
      inputIsCached.mockResolvedValue(true);
      getCachedInput.mockResolvedValue(input);
      inputIsValid.mockReturnValue(true);
      const result = await getPuzzleInput({
        year: 2022,
        day: 1,
        authToken: 'ASDF',
      });
      expect(getCachedInput).toHaveBeenCalled();
      expect(result).toEqual({ input });
    });

    test('does not download', async () => {
      inputIsCached.mockResolvedValue(true);
      inputIsValid.mockReturnValue(true);
      await getPuzzleInput({ year: 2022, day: 1, authToken: 'ASDF' });
      expect(downloadInput).not.toHaveBeenCalled();
    });

    test('does not re-cache', async () => {
      inputIsCached.mockResolvedValue(true);
      inputIsValid.mockReturnValue(true);
      await getPuzzleInput({ year: 2022, day: 1, authToken: 'ASDF' });
      expect(cacheInput).not.toHaveBeenCalled();
    });

    test('fails if input is invalid', async () => {
      const input = 'ASDF';
      inputIsCached.mockResolvedValue(true);
      getCachedInput.mockResolvedValue(input);
      inputIsValid.mockReturnValue(false);
      const result = await getPuzzleInput({
        year: 2022,
        day: 1,
        authToken: 'ASDF',
      });
      expect(result).toBe(false);
    });
  });

  describe('input is not cached', () => {
    test('downloaded value and returns', async () => {
      const input = 'ASDF';
      getAuthenticationToken.mockReturnValue({ authToken: 'ASDF' });
      inputIsCached.mockResolvedValue(false);
      downloadInput.mockResolvedValue(input);
      inputIsValid.mockReturnValue(true);
      const result = await getPuzzleInput({ year: 2022, day: 1 });
      expect(result).toEqual({ input });
    });

    test('does not cache if download fails', async () => {
      getAuthenticationToken.mockReturnValue({ authToken: 'ASDF' });
      inputIsCached.mockResolvedValue(false);
      downloadInput.mockRejectedValue(new Error());
      inputIsValid.mockReturnValue(true);
      await expect(async () =>
        getPuzzleInput({ year: 2022, day: 1 })
      ).rejects.toThrow();
      expect(downloadInput).toHaveBeenCalled();
      expect(cacheInput).not.toHaveBeenCalled();
    });

    test('caches if downloads', async () => {
      const args = { year: 2022, day: 10 };
      const input = 'ASDFASDF';
      getAuthenticationToken.mockReturnValue({ authToken: 'ASDF' });
      inputIsCached.mockResolvedValue(false);
      downloadInput.mockResolvedValue(input);
      inputIsValid.mockReturnValue(true);
      await getPuzzleInput(args);
      expect(cacheInput).toHaveBeenCalledWith(args.year, args.day, input);
    });

    test('fails if input is invalid', async () => {
      const input = 'ASDF';
      getAuthenticationToken.mockReturnValue({ authToken: 'ASDF' });
      inputIsCached.mockResolvedValue(false);
      downloadInput.mockResolvedValue(input);
      inputIsValid.mockReturnValue(false);
      const result = await getPuzzleInput({ year: 2022, day: 1 });
      expect(result).toBe(false);
    });
  });
});
