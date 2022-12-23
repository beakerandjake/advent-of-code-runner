import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks';

// setup mocks.
mockLogger();
mockConfig();
jest.unstable_mockModule('src/api/index.js', () => ({ downloadInput: jest.fn() }));
jest.unstable_mockModule('src/inputs.js', () => ({
  inputIsCached: jest.fn(),
  getCachedInput: jest.fn(),
  cacheInput: jest.fn(),
}));

// import mocks after setting up mocks
const { downloadInput } = await import('../../src/api/index.js');
const { inputIsCached, getCachedInput, cacheInput } = await import('../../src/inputs.js');
const { getPuzzleInput } = await import('../../src/actions/links/getPuzzleInput.js');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('links', () => {
    describe('getPuzzleInput()', () => {
      test('returns cached value if cached', async () => {
        const input = 'ASDF';
        inputIsCached.mockResolvedValue(true);
        getCachedInput.mockResolvedValue(input);
        const result = await getPuzzleInput({ year: 2022, day: 1, authToken: 'ASDF' });
        expect(getCachedInput).toHaveBeenCalled();
        expect(result).toEqual({ input });
      });

      test('does not download if cached', async () => {
        inputIsCached.mockResolvedValue(true);
        await getPuzzleInput({ year: 2022, day: 1, authToken: 'ASDF' });
        expect(downloadInput).not.toHaveBeenCalled();
      });

      test('does not cache if cached', async () => {
        inputIsCached.mockResolvedValue(true);
        await getPuzzleInput({ year: 2022, day: 1, authToken: 'ASDF' });
        expect(cacheInput).not.toHaveBeenCalled();
      });

      test('returns downloaded value if not cached', async () => {
        const input = 'ASDF';
        inputIsCached.mockResolvedValue(false);
        downloadInput.mockResolvedValue(input);
        const result = await getPuzzleInput({ year: 2022, day: 1, authToken: 'ASDF' });
        expect(result).toEqual({ input });
      });

      test('does not cache if download fails', async () => {
        inputIsCached.mockResolvedValue(false);
        downloadInput.mockRejectedValue(new Error());
        await expect(async () => getPuzzleInput({ year: 2022, day: 1, authToken: 'ASDF' })).rejects.toThrow();
        expect(downloadInput).toHaveBeenCalled();
        expect(cacheInput).not.toHaveBeenCalled();
      });

      test('caches if downloads', async () => {
        const args = { year: 2022, day: 10, authToken: 'ASDF' };
        const input = 'ASDFASDF';
        inputIsCached.mockResolvedValue(false);
        downloadInput.mockResolvedValue(input);
        await getPuzzleInput(args);
        expect(cacheInput).toHaveBeenCalledWith(args.year, args.day, input);
      });
    });
  });
});
