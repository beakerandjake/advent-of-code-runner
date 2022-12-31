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
const { createDotEnv } = await import('../../src/initialize/createDotEnv.js');

describe('initialize', () => {
  describe('createDotEnv()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test.each([
      null, undefined, '',
    ])('throws if auth token is: "%s"', async (authToken) => {
      await expect(async () => createDotEnv({ authToken })).rejects.toThrow();
    });

    test('loads template source file', async () => {
      const paths = { source: 'source.txt', dest: 'dest.txt' };
      getConfigValue.mockImplementation((key) => (key === 'paths.templates.dotenv' ? paths : undefined));
      await createDotEnv({ authToken: 'asdf' });
      expect(readFile).toHaveBeenCalledWith(paths.source, expect.anything());
    });

    test('tokenizes template source file contents', async () => {
      getConfigValue.mockImplementation((key) => (key === 'paths.templates.dotenv' ? {} : undefined));
      const fileContents = 'ASDFASDFasDF';
      readFile.mockResolvedValue(fileContents);
      const authToken = 'ASDF';
      await createDotEnv({ authToken });
      expect(replaceTokens)
        .toHaveBeenCalledWith(expect.any(Array), { authToken }, fileContents);
    });

    test('tokenizes template source file contents', async () => {
      const paths = { source: 'asdf.txt', dest: 'qwer.txt' };
      getConfigValue.mockImplementation((key) => (key === 'paths.templates.dotenv' ? paths : undefined));
      const contents = 'ASDF';
      replaceTokens.mockReturnValue(contents);
      await createDotEnv({ authToken: 1234 });
      expect(outputFile).toHaveBeenCalledWith(paths.dest, contents);
    });
  });
});
