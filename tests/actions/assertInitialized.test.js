import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/persistence/userDataFile.js', () => ({ userDataFileExists: jest.fn() }));

// import after mocks set up
const { userDataFileExists } = await import('../../src/persistence/userDataFile.js');
const { assertInitialized } = await import('../../src/actions/links/assertInitialized.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('links', () => {
    describe('assertInitialized()', () => {
      test('returns true if data store file exists', async () => {
        userDataFileExists.mockResolvedValue(true);
        const result = await assertInitialized();
        expect(result).toBe(true);
      });

      test('returns false if data store file does not exist', async () => {
        userDataFileExists.mockResolvedValue(false);
        const result = await assertInitialized();
        expect(result).toBe(false);
      });
    });
  });
});
