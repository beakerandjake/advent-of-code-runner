import { describe, jest, test, afterEach } from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/validation/validatePuzzle.js', () => ({
  getAllPuzzlesForYear: jest.fn(),
}));

// import after mocks set up
const { getAllPuzzlesForYear } = await import('../../src/validation/validatePuzzle.js');
const { assertPuzzleHasLevel } = await import(
  '../../src/actions/assertPuzzleHasLevel.js'
);

describe('assertPuzzleHasLevel()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns true if puzzle has level', () => {
    const puzzles = [
      { year: 2022, day: 1, level: 1 },
      { year: 2022, day: 1, level: 2 },
      { year: 2022, day: 1, level: 3 },
      { year: 2022, day: 2, level: 1 },
    ];
    getAllPuzzlesForYear.mockReturnValue(puzzles);
    for (const puzzle of puzzles) {
      const result = assertPuzzleHasLevel(puzzle);
      expect(result).toBe(true);
    }
  });

  test('returns false if puzzle does not have level', () => {
    getAllPuzzlesForYear.mockReturnValue([
      { year: 2022, day: 1, level: 1 },
      { year: 2022, day: 1, level: 2 },
      { year: 2022, day: 1, level: 3 },
      { year: 2022, day: 2, level: 1 },
    ]);
    const result = assertPuzzleHasLevel({ year: 2022, day: 1, level: 4 });
    expect(result).toBe(false);
  });
});
