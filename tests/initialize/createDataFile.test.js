import { describe, jest, test, beforeEach } from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const { getConfigValue } = mockConfig();
jest.unstable_mockModule('fs-extra/esm', () => ({ outputFile: jest.fn() }));
jest.unstable_mockModule('node:fs/promises', () => ({ readFile: jest.fn() }));
jest.unstable_mockModule('src/initialize/replaceTokens.js', () => ({
  replaceTokens: jest.fn(),
}));

// import after mocks set up
const { outputFile } = await import('fs-extra/esm');
const { readFile } = await import('node:fs/promises');
const { replaceTokens } = await import('../../src/initialize/replaceTokens.js');
const { createDataFile } = await import(
  '../../src/initialize/createDataFile.js'
);

describe('initialize', () => {
  describe('createDataFile()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test.each([null, undefined])('throws if year is: "%s"', async (year) => {
      await expect(async () => createDataFile(year)).rejects.toThrow();
    });

    test('loads template data file', async () => {
      const paths = { source: 'source.txt', dest: 'dest.txt' };
      getConfigValue.mockImplementation((key) =>
        key === 'paths.templates.userDataFile' ? paths : undefined
      );
      await createDataFile(2022);
      expect(readFile).toHaveBeenCalledWith(paths.source, expect.anything());
    });

    test('tokenizes template file contents', async () => {
      getConfigValue.mockImplementation((key) =>
        key === 'paths.templates.userDataFile' ? {} : undefined
      );
      const fileContents = 'ASDFASDFasDF';
      readFile.mockResolvedValue(fileContents);
      const year = 2022;
      await createDataFile(year);
      expect(replaceTokens).toHaveBeenCalledWith(
        expect.any(Array),
        { year },
        fileContents
      );
    });

    test('tokenizes template file contents', async () => {
      const paths = { source: 'asdf.txt', dest: 'qwer.txt' };
      getConfigValue.mockImplementation((key) =>
        key === 'paths.templates.userDataFile' ? paths : undefined
      );
      const contents = 'ASDF';
      replaceTokens.mockReturnValue(contents);
      await createDataFile(2022);
      expect(outputFile).toHaveBeenCalledWith(paths.dest, contents);
    });
  });
});
