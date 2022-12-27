import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks.
mockLogger();

jest.unstable_mockModule('src/config.js', () => ({
  getConfigValue: jest.fn(),
}));

jest.unstable_mockModule('src/api/index.js', () => ({
  downloadInput: jest.fn(),
}));

jest.unstable_mockModule('src/persistence/io.js', () => ({
  saveFile: jest.fn(),
  loadFileContents: jest.fn(),
  fileExists: jest.fn(),
}));

const { getConfigValue } = await import('../../src/config.js');
const { fileExists, loadFileContents, saveFile } = await import('../../src/persistence/io.js');
const { getCachedInput, cacheInput, inputIsCached } = await import('../../src/inputs/inputCache.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('inputCache', () => {
  describe('cacheInput()', () => {
    test('saves input to file', async () => {
      const input = 'asdf';
      getConfigValue.mockReturnValueOnce('asdf');

      await cacheInput(2022, 1, input);

      expect(saveFile).toHaveBeenCalledWith(expect.any(String), input);
    });
  });

  describe('inputIsCached()', () => {
    test('returns true if file exists', async () => {
      getConfigValue.mockReturnValueOnce('asdf');
      fileExists.mockResolvedValueOnce(true);
      const result = await inputIsCached(2022, 1, 'asdf');
      expect(result).toBe(true);
    });

    test('returns false if file does not exist', async () => {
      getConfigValue.mockReturnValueOnce('asdf');
      fileExists.mockResolvedValueOnce(false);
      const result = await inputIsCached(2022, 1, 'asdf');
      expect(result).toBe(false);
    });
  });

  describe('getCachedInput()', () => {
    test('returns file contents', async () => {
      const expected = 'ASDF';
      getConfigValue.mockReturnValueOnce('asdf');
      loadFileContents.mockResolvedValueOnce(expected);
      const result = await getCachedInput(2022, 1);
      expect(result).toBe(expected);
    });
  });
});
