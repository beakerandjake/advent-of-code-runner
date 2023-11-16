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
const { replaceTokens } = await import('../../src/initialize/replaceTokens.js');
const { getSolutionFileName } = await import(
  '../../src/solutions/solutionRunner.js'
);

describe('initialize', () => {
  describe('createSolutionFiles()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test.each([null, undefined, ''])(
      'throws if year is: "%s"',
      async (year) => {
        await expect(async () => createSolutionFiles(year)).rejects.toThrow();
      }
    );

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
      await createSolutionFiles(2022);
      expect(ensureDir).toHaveBeenCalledWith('asdf');
    });

    test('loads default template solution file', async () => {
      getConfigValue.mockImplementation((key) => {
        switch (key) {
          case 'paths.solutionsDir':
            return 'asdf';
          case 'paths.templates.solutionDefault':
            return 'default.txt';
          case 'aoc.validation.days':
            return [];
          default:
            return undefined;
        }
      });
      await createSolutionFiles(2022);
      expect(readFile).toHaveBeenCalledWith('default.txt', expect.anything());
    });

    test('loads last day template solution file', async () => {
      getConfigValue.mockImplementation((key) => {
        switch (key) {
          case 'paths.solutionsDir':
            return 'asdf';
          case 'paths.templates.solutionLastDay':
            return 'lastDay.txt';
          case 'aoc.validation.days':
            return [];
          default:
            return undefined;
        }
      });
      await createSolutionFiles(2022);
      expect(readFile).toHaveBeenCalledWith('lastDay.txt', expect.anything());
    });

    test('creates a file for each day', async () => {
      const days = [1, 2, 3, 4, 5];

      // setup mock to return days.
      getConfigValue.mockImplementation((key) => {
        switch (key) {
          case 'aoc.validation.days':
            return days;
          default:
            return undefined;
        }
      });

      await createSolutionFiles(2022);
      expect(writeFile).toHaveBeenCalledTimes(days.length);
    });

    test('creates (days - 1) default solution files', async () => {
      const days = [1, 2, 3, 4, 5];
      const defaultTemplateName = 'default.txt';
      const defaultTemplateContents = 'DEFAULT';

      // setup mocks to ensure expected values are passed through
      getConfigValue.mockImplementation((key) => {
        switch (key) {
          case 'paths.templates.solutionDefault':
            return defaultTemplateName;
          case 'aoc.validation.days':
            return days;
          default:
            return undefined;
        }
      });
      replaceTokens.mockImplementation((tokens, args, target) => target);
      readFile.mockImplementation((fileName) => {
        switch (fileName) {
          case defaultTemplateName:
            return defaultTemplateContents;
          default:
            return 'WRONG';
        }
      });
      getSolutionFileName.mockImplementation((day) => day);

      await createSolutionFiles(2022);

      // expect num of writes with default file contents to equal n - 1
      const allButLastDay = new Set(days.slice(0, -1));
      const writes = writeFile.mock.calls.filter(
        ([name, content]) =>
          allButLastDay.has(name) && content === defaultTemplateContents
      );
      expect(writes.length).toBe(days.length - 1);
    });

    test('creates last day solution file', async () => {
      const days = [1, 2, 3, 4, 5];
      const lastDayTemplateName = 'lastDay.txt';
      const lastDayContents = 'LAST';

      // setup mocks to ensure expected values are passed through
      getConfigValue.mockImplementation((key) => {
        switch (key) {
          case 'paths.templates.solutionLastDay':
            return lastDayTemplateName;
          case 'aoc.validation.days':
            return days;
          default:
            return undefined;
        }
      });
      replaceTokens.mockImplementation((tokens, args, target) => target);
      readFile.mockImplementation((fileName) => {
        switch (fileName) {
          case lastDayTemplateName:
            return lastDayContents;
          default:
            return 'WRONG';
        }
      });
      getSolutionFileName.mockImplementation((day) => day);

      await createSolutionFiles(2022);

      // expect one write with last day file name.
      const writes = writeFile.mock.calls.filter(
        ([name, content]) => name === days.at(-1) && content === lastDayContents
      );
      expect(writes.length).toBe(1);
    });
  });
});
