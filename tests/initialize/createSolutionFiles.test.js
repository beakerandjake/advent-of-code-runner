import { describe, jest, test, beforeEach } from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const { getConfigValue } = mockConfig();
jest.unstable_mockModule('fs-extra/esm', () => ({ ensureDir: jest.fn() }));
jest.unstable_mockModule('node:fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));
jest.unstable_mockModule('src/initialize/replaceTokens.js', () => ({
  replaceTokens: jest.fn(),
}));
jest.unstable_mockModule('src/solutions/solutionRunner.js', () => ({
  getSolutionFileName: jest.fn(),
}));

// import after mocks set up
const { ensureDir } = await import('fs-extra/esm');
const { readFile, writeFile } = await import('node:fs/promises');
const { createSolutionFiles } = await import(
  '../../src/initialize/createSolutionFiles.js'
);

describe('initialize', () => {
  describe('createSolutionFiles()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test.each([null, undefined])('throws if year is: "%s"', async (year) => {
      await expect(async () => createSolutionFiles({ year })).rejects.toThrow();
    });

    test('creates solution dir', async () => {
      getConfigValue.mockImplementation((key) => {
        switch (key) {
          case 'paths.solutionsDir':
            return 'asdf';
          case 'paths.templates.solution':
            return 'asdf.txt';
          case 'aoc.validation.days':
            return [];
          default:
            return undefined;
        }
      });
      await createSolutionFiles({ year: 2022 });
      expect(ensureDir).toHaveBeenCalledWith('asdf');
    });

    test('loads template solution file', async () => {
      getConfigValue.mockImplementation((key) => {
        switch (key) {
          case 'paths.solutionsDir':
            return 'asdf';
          case 'paths.templates.solution':
            return 'asdf.txt';
          case 'aoc.validation.days':
            return [];
          default:
            return undefined;
        }
      });
      await createSolutionFiles({ year: 2022 });
      expect(readFile).toHaveBeenCalledWith('asdf.txt', expect.anything());
    });

    test('creates file for each day', async () => {
      const days = [1, 2, 3, 4, 5];
      getConfigValue.mockImplementation((key) => {
        switch (key) {
          case 'paths.solutionsDir':
            return 'asdf';
          case 'paths.templates.solution':
            return 'asdf.txt';
          case 'aoc.validation.days':
            return days;
          default:
            return undefined;
        }
      });
      await createSolutionFiles({ year: 2022 });
      expect(writeFile).toHaveBeenCalledTimes(days.length);
    });
  });
});
