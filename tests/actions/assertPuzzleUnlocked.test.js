import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const puzzleIsInFuture = jest.fn();
jest.unstable_mockModule('src/validation/validatePuzzle.js', () => ({ puzzleIsInFuture }));

// import after mocks set up
const { assertPuzzleUnlocked } = await import('../../src/actions/assertPuzzleUnlocked.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('links', () => {
    describe('assertPuzzleUnlocked()', () => {
      test('returns true if puzzle is unlocked', () => {
        puzzleIsInFuture.mockReturnValue(false);
        const result = assertPuzzleUnlocked({ year: 2022, day: 1 });
        expect(result).toBe(true);
      });

      test('returns false if puzzle is locked', () => {
        puzzleIsInFuture.mockReturnValue(true);
        const result = assertPuzzleUnlocked({ year: 2022, day: 1 });
        expect(result).toBe(false);
      });
    });
  });
});
