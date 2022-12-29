import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const { getConfigValue } = mockConfig();
jest.unstable_mockModule('fs-extra/esm', () => ({ copy: jest.fn() }));

// import after mocks set up
const { copy } = await import('fs-extra/esm');
const { createGitIgnore } = await import('../../src/initialize/createGitIgnore.js');

describe('initialize', () => {
  describe('createGitIgnore()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('copies template file', async () => {
      const paths = { source: 'source.txt', dest: 'dest.txt' };
      getConfigValue.mockImplementation((key) => (key === 'paths.templates.gitignore' ? paths : undefined));
      await createGitIgnore();
      expect(copy).toBeCalledWith(paths.source, paths.dest);
    });
  });
});
