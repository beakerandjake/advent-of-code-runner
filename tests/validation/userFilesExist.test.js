import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockConfig } from '../mocks.js';

// setup mocks
const { getConfigValue } = mockConfig();
jest.unstable_mockModule('fs-extra/esm', () => ({ outputFile: jest.fn(), pathExists: jest.fn() }));

// import after mocks set up
const { pathExists } = await import('fs-extra/esm');
const { readmeExists } = await import('../../src/validation/userFilesExist.js');

describe('userFilesExist', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('readmeExists()', () => {
    test('loads expected config value', async () => {
      await readmeExists();
      expect(getConfigValue).toBeCalledWith('paths.readme');
    });

    test('returns true if exists', async () => {
      pathExists.mockResolvedValue(true);
      const result = await readmeExists();
      expect(result).toBe(true);
    });

    test('returns false if does not exist', async () => {
      pathExists.mockResolvedValue(false);
      const result = await readmeExists();
      expect(result).toBe(false);
    });
  });
});
