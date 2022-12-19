import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockLogger } from '../mocks';

// setup mocks.
mockLogger();

jest.unstable_mockModule('../../src/config.js', () => ({
  getConfigValue: jest.fn(),
}));

jest.unstable_mockModule('../../src/api/index.js', () => ({
  downloadInput: jest.fn(),
}));

jest.unstable_mockModule('../../src/inputs/inputCache.js', () => ({
  inputIsCached: jest.fn(),
  getCachedInput: jest.fn(),
  cacheInput: jest.fn(),
}));

const { downloadInput } = await import('../../src/api/index.js');
const { inputIsCached, getCachedInput, cacheInput } = await import('../../src/inputs/inputCache.js');
const { getInput } = await import('../../src/inputs/getInput.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getInput', () => {
  test('returns cached if cached', async () => {
    const expected = 'ASDF';
    inputIsCached.mockResolvedValueOnce(true);
    getCachedInput.mockResolvedValueOnce(expected);

    const result = await getInput(2000, 1);

    expect(downloadInput).not.toHaveBeenCalled();
    expect(cacheInput).not.toHaveBeenCalled();
    expect(result).toBe(expected);
  });

  test('downloads and caches if not cached', async () => {
    const expected = 'ASDF';
    inputIsCached.mockResolvedValueOnce(false);
    downloadInput.mockResolvedValueOnce(expected);

    const result = await getInput(2000, 1);

    expect(cacheInput).toHaveBeenCalled();
    expect(getCachedInput).not.toHaveBeenCalled();
    expect(result).toBe(expected);
  });
});
