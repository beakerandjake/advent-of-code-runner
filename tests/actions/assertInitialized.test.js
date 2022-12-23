import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/persistence/jsonFileStore.js', () => ({ dataStoreFileExists: jest.fn() }));

// import after mocks set up
const { dataStoreFileExists } = await import('../../src/persistence/jsonFileStore');
const { assertInitialized } = await import('../../src/actions/links/assertInitialized.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('links', () => {
    describe('assertInitialized()', () => {
      test('returns true if data store file exists', async () => {
        dataStoreFileExists.mockResolvedValue(true);
        const result = await assertInitialized();
        expect(result).toBe(true);
      });

      test('returns false if data store file does not exist', async () => {
        dataStoreFileExists.mockResolvedValue(false);
        const result = await assertInitialized();
        expect(result).toBe(false);
      });
    });
  });
});
