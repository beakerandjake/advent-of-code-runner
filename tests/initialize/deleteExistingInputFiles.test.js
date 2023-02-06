import { describe, jest, test, beforeEach } from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const { getConfigValue } = mockConfig();
jest.unstable_mockModule('fs-extra/esm', () => ({ emptyDir: jest.fn() }));

// import after mocks set up
const { emptyDir } = await import('fs-extra/esm');
const { deleteExistingInputFiles } = await import(
  '../../src/initialize/deleteExistingInputFiles.js'
);

describe('initialize', () => {
  describe('deleteExistingInputFiles()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('empties inputsDir', async () => {
      const expected = 'ASDF';
      getConfigValue.mockImplementation((key) =>
        key === 'paths.inputsDir' ? expected : undefined
      );
      await deleteExistingInputFiles();
      expect(emptyDir).toBeCalledWith(expected);
    });
  });
});
