import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockLogger } from '../mocks';

// setup mocks.
mockLogger();

jest.unstable_mockModule('src/config.js', () => ({
  getConfigValue: jest.fn(),
}));

jest.unstable_mockModule('src/api/index.js', () => ({
  downloadInput: jest.fn(),
}));

jest.unstable_mockModule('src/inputs.js', () => ({
  inputIsCached: jest.fn(),
  getCachedInput: jest.fn(),
  cacheInput: jest.fn(),
}));

const { downloadInput } = await import('../../src/api/index.js');
const { inputIsCached, getCachedInput, cacheInput } = await import('../../src/inputs.js');
const { getPuzzleInput } = await import('../../src/actions/getPuzzleInput.js');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getPuzzleInput', () => {
  test('returns cached value if cached', async () => {
    const expected = 'ASDF';
    inputIsCached.mockResolvedValueOnce(true);
    getCachedInput.mockResolvedValueOnce(expected);
    const result = await getPuzzleInput(2000, 1);
    expect(getCachedInput).toHaveBeenCalled();
    expect(result).toBe(expected);
  });

  test('does not download if cached', async () => {
    inputIsCached.mockResolvedValueOnce(true);
    await getPuzzleInput(2000, 1);
    expect(downloadInput).not.toHaveBeenCalled();
  });

  test('does not cache if cached', async () => {
    inputIsCached.mockResolvedValueOnce(true);
    await getPuzzleInput(2000, 1);
    expect(cacheInput).not.toHaveBeenCalled();
  });

  test('returns downloaded value if not cached', async () => {
    const expected = 'ASDF';
    inputIsCached.mockResolvedValueOnce(false);
    downloadInput.mockResolvedValueOnce(expected);
    const result = await getPuzzleInput(2000, 1);
    expect(result).toBe(expected);
  });

  test('does not cache if download fails', async () => {
    inputIsCached.mockResolvedValueOnce(false);
    downloadInput.mockRejectedValue(new Error());
    await expect(async () => getPuzzleInput(2000, 1)).rejects.toThrow();
    expect(downloadInput).toHaveBeenCalled();
    expect(cacheInput).not.toHaveBeenCalled();
  });

  test('caches if downloads', async () => {
    inputIsCached.mockResolvedValueOnce(false);
    await getPuzzleInput(2000, 1);
    expect(cacheInput).toHaveBeenCalled();
  });

  test('caches with result of download', async () => {
    const year = 2000;
    const day = 1;
    const downloadResult = 'ASDF';
    inputIsCached.mockResolvedValueOnce(false);
    downloadInput.mockResolvedValueOnce(downloadResult);
    await getPuzzleInput(2000, 1);
    expect(cacheInput).toHaveBeenCalledWith(year, day, downloadResult);
  });
});
