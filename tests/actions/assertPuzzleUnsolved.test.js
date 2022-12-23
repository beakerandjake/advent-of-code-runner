import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/answers.js', () => ({ puzzleHasBeenSolved: jest.fn() }));

// import after mocks set up
const { puzzleHasBeenSolved } = await import('../../src/answers.js');
const { assertPuzzleUnsolved } = await import('../../src/actions/links/assertPuzzleUnsolved.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('common', () => {
    describe('assertPuzzleUnsolved()', () => {
      test('returns true if puzzle has not been solved', async () => {
        puzzleHasBeenSolved.mockResolvedValue(false);
        const result = await assertPuzzleUnsolved({ year: 2022, day: 1, part: 1 });
        expect(result).toBe(true);
      });

      test('returns true if puzzle has been solved', async () => {
        puzzleHasBeenSolved.mockResolvedValue(true);
        const result = await assertPuzzleUnsolved({ year: 2022, day: 1, part: 1 });
        expect(result).toBe(false);
      });
    });
  });
});
