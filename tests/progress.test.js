import { describe, jest, test } from '@jest/globals';

// setup mocks.
jest.unstable_mockModule('../src/repositories/puzzleRepository.js', () => ({
  findPuzzle: jest.fn(),
}));

jest.unstable_mockModule('../src/logger.js', () => ({
  logger: {
    debug: jest.fn(),
  },
}));

// import after setting up the mock so the modules import the mocked version
const { findPuzzle } = await import('../src/repositories/puzzleRepository.js');
const { puzzleHasBeenSolved } = await import('../src/progress.js');

describe('progress', () => {
  describe('puzzleHasBeenSolved()', () => {
    test('returns false if puzzle not found', async () => {
      findPuzzle.mockReturnValueOnce(null);
      expect(await puzzleHasBeenSolved(2022, 1, 1)).toBe(false);
    });

    test('returns true if puzzle has correctAnswer', async () => {
      findPuzzle.mockReturnValueOnce({
        correctAnswer: 'bobcat',
      });
      expect(await puzzleHasBeenSolved(2022, 12, 1)).toBe(true);
    });

    test('returns true if puzzle does not correctAnswer', async () => {
      findPuzzle.mockReturnValueOnce({
        correctAnswer: null,
      });
      expect(await puzzleHasBeenSolved(2022, 12, 1)).toBe(false);
    });
  });
});
