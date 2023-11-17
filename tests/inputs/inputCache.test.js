import { describe, jest, test, beforeEach } from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks.
mockLogger();
const { getConfigValue } = mockConfig();
jest.unstable_mockModule('node:fs/promises', () => ({ readFile: jest.fn() }));
jest.unstable_mockModule('node:path', () => ({ join: jest.fn() }));
jest.unstable_mockModule('fs-extra/esm', () => ({
  outputFile: jest.fn(),
  pathExists: jest.fn(),
}));

const { readFile } = await import('node:fs/promises');
const { outputFile, pathExists } = await import('fs-extra/esm');
const { getCachedInput, cacheInput, inputIsCached } = await import(
  '../../src/inputs/inputCache.js'
);

beforeEach(() => {
  jest.resetAllMocks();
});

describe('inputCache', () => {
  describe('cacheInput()', () => {
    test('saves input to file', async () => {
      const input = 'asdf';
      await cacheInput(2022, 1, input);
      expect(outputFile).toHaveBeenCalledWith(undefined, input);
    });
  });

  describe('inputIsCached()', () => {
    test('returns true if file exists', async () => {
      getConfigValue.mockReturnValueOnce('asdf');
      pathExists.mockResolvedValueOnce(true);
      const result = await inputIsCached(2022, 1, 'asdf');
      expect(result).toBe(true);
    });

    test('returns false if file does not exist', async () => {
      getConfigValue.mockReturnValueOnce('asdf');
      pathExists.mockResolvedValueOnce(false);
      const result = await inputIsCached(2022, 1, 'asdf');
      expect(result).toBe(false);
    });
  });

  describe('getCachedInput()', () => {
    test('returns file contents', async () => {
      const expected = 'ASDF';
      readFile.mockResolvedValueOnce(expected);
      const result = await getCachedInput(2022, 1);
      expect(result).toBe(expected);
    });
  });
});
