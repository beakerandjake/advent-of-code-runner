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
const { createReadme } = await import('../../src/initialize/createReadme.js');

describe('initialize', () => {
  describe('createReadme()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('copies template file', async () => {
      const paths = { source: 'source.txt', dest: 'dest.txt' };
      getConfigValue.mockImplementation((key) => (key === 'paths.templates.readme' ? paths : undefined));
      await createReadme();
      expect(copy).toBeCalledWith(paths.source, paths.dest);
    });
  });
});
