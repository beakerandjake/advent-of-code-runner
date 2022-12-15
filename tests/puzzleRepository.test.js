import { describe, jest, test } from '@jest/globals';
import { UserDataTranslationError } from '../src/errors/index.js';

// setup getConfigValue so it can be mocked.
jest.unstable_mockModule('../src/user-data/jsonFileStore.js', () => ({
  getStoreValue: jest.fn(),
  setStoreValue: jest.fn(),
}));

// import after setting up the mock so the modules import the mocked version
const { translateToPuzzle } = await import('../src/user-data/puzzleRepository.js');

describe('puzzleRepository', () => {
  describe('translateToPuzzle()', () => {
    test('throws with null value', () => {
      expect(() => translateToPuzzle(null)).toThrow(UserDataTranslationError);
    });
  });
});
