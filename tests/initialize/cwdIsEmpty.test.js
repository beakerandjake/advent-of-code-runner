import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockConfig } from '../mocks.js';

// setup mocks
const { getConfigValue } = mockConfig();
jest.unstable_mockModule('node:fs/promises', () => ({ readdir: jest.fn() }));

// import after mocks set up
const { readdir } = await import('node:fs/promises');
const { cwdIsEmpty } = await import('../../src/initialize/cwdIsEmpty.js');

describe('initialize', () => {
  describe('cwdIsEmpty()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('true if no files and empty whitelist', async () => {
      readdir.mockResolvedValue([]);
      getConfigValue.mockImplementation((key) => (key === 'initialize.emptyCwdWhitelist' ? [] : undefined));
      const result = await cwdIsEmpty();
      expect(result).toBe(true);
    });

    test('true if no files and has whitelist', async () => {
      readdir.mockResolvedValue([]);
      getConfigValue.mockImplementation((key) => (key === 'initialize.emptyCwdWhitelist' ? ['asdf.txt'] : undefined));
      const result = await cwdIsEmpty();
      expect(result).toBe(true);
    });

    test('false if files and empty whitelist', async () => {
      readdir.mockResolvedValue(['cool_guy.txt']);
      getConfigValue.mockImplementation((key) => (key === 'initialize.emptyCwdWhitelist' ? [] : undefined));
      const result = await cwdIsEmpty();
      expect(result).toBe(false);
    });

    test('false if files and no whitelist match', async () => {
      readdir.mockResolvedValue(['cool_guy.txt']);
      getConfigValue.mockImplementation((key) => (key === 'initialize.emptyCwdWhitelist' ? ['asdf.txt'] : undefined));
      const result = await cwdIsEmpty();
      expect(result).toBe(false);
    });

    test('true if files and whitelist match', async () => {
      readdir.mockResolvedValue(['cool_guy.txt']);
      getConfigValue.mockImplementation((key) => (key === 'initialize.emptyCwdWhitelist' ? ['cool_guy.txt'] : undefined));
      const result = await cwdIsEmpty();
      expect(result).toBe(true);
    });
  });
});
