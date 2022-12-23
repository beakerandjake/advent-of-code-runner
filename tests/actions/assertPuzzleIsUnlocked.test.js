import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const puzzleIsInFuture = jest.fn();
jest.unstable_mockModule('src/validation/validatePuzzle.js', () => ({ puzzleIsInFuture }));

// import after mocks set up
const { assertPuzzleIsUnlocked } = await import('../../src/actions/links/assertPuzzleIsUnlocked.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('common', () => {
    describe('assertPuzzleIsUnlocked()', () => {
      test('returns true if puzzle is unlocked', () => {
        puzzleIsInFuture.mockReturnValue(false);
        const result = assertPuzzleIsUnlocked({ year: 2022, day: 1 });
        expect(result).toBe(true);
      });

      test('returns false if puzzle is locked', () => {
        puzzleIsInFuture.mockReturnValue(true);
        const result = assertPuzzleIsUnlocked({ year: 2022, day: 1 });
        expect(result).toBe(false);
      });
    });
  });
});
