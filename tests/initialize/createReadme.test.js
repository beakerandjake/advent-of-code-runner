import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const { getConfigValue } = mockConfig();
jest.unstable_mockModule('fs-extra/esm', () => ({ outputFile: jest.fn() }));
jest.unstable_mockModule('node:fs/promises', () => ({ readFile: jest.fn() }));
jest.unstable_mockModule('src/initialize/replaceTokens.js', () => ({ replaceTokens: jest.fn() }));

// import after mocks set up
const { outputFile } = await import('fs-extra/esm');
const { readFile } = await import('node:fs/promises');
const { replaceTokens } = await import('../../src/initialize/replaceTokens.js');
const { createReadme } = await import('../../src/initialize/createReadme.js');

describe('initialize', () => {
  describe('createReadme()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test.each([
      null, undefined, '',
    ])('throws if year is: "%s"', async (year) => {
      await expect(async () => createReadme({ year })).rejects.toThrow();
    });

    test('loads template source file', async () => {
      const paths = { source: 'source.txt', dest: 'dest.txt' };
      getConfigValue.mockImplementation((key) => {
        if (key === 'paths.templates.readme') {
          return paths.source;
        }
        if (key === 'paths.readme') {
          return paths.dest;
        }
        throw new Error('unknown config key');
      });
      await createReadme({ year: 2022 });
      expect(readFile).toHaveBeenCalledWith(paths.source, expect.anything());
    });

    test('tokenizes template source file contents', async () => {
      const paths = { source: 'source.txt', dest: 'dest.txt' };
      getConfigValue.mockImplementation((key) => {
        if (key === 'paths.templates.readme') {
          return paths.source;
        }
        if (key === 'paths.readme') {
          return paths.dest;
        }
        throw new Error('unknown config key');
      });
      const fileContents = 'ASDFASDFasDF';
      readFile.mockResolvedValue(fileContents);
      const year = 2023;
      await createReadme({ year });
      expect(replaceTokens)
        .toHaveBeenCalledWith(expect.any(Array), { year }, fileContents);
    });

    test('saves tokenized contents', async () => {
      const paths = { source: 'source.txt', dest: 'dest.txt' };
      getConfigValue.mockImplementation((key) => {
        if (key === 'paths.templates.readme') {
          return paths.source;
        }
        if (key === 'paths.readme') {
          return paths.dest;
        }
        throw new Error('unknown config key');
      });
      const contents = 'ASDF';
      replaceTokens.mockReturnValue(contents);
      await createReadme({ year: 2022 });
      expect(outputFile).toHaveBeenCalledWith(paths.dest, contents);
    });
  });
});
