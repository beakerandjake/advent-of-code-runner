import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/actions/actionUtil.js', () => ({ getYear: jest.fn() }));
jest.unstable_mockModule('src/answers.js', () => ({ getNextUnansweredPuzzle: jest.fn() }));
jest.unstable_mockModule('src/actions/solvePuzzle.js', () => ({ solvePuzzle: jest.fn() }));

// import after mocks set up
const { getNextUnansweredPuzzle } = await import('../../src/answers.js');
const { solvePuzzle } = await import('../../src/actions/solvePuzzle.js');
const { autoSolve } = await import('../../src/actions/autoSolve.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('autoSolve()', () => {
    test('does not solve if all puzzles answered', async () => {
      getNextUnansweredPuzzle.mockResolvedValue(null);
      await autoSolve();
      expect(solvePuzzle).not.toHaveBeenCalled();
    });

    test('solve if has unanswered puzzle', async () => {
      const expected = { day: 1, part: 1 };
      getNextUnansweredPuzzle.mockResolvedValue(expected);
      await autoSolve();
      expect(solvePuzzle).toHaveBeenCalledWith(expected.day, expected.part);
    });
  });
});
