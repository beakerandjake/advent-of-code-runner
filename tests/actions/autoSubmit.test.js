import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/actions/actionUtil.js', () => ({ getYear: jest.fn() }));
jest.unstable_mockModule('src/answers.js', () => ({ getNextUnansweredPuzzle: jest.fn() }));
jest.unstable_mockModule('src/actions/solvePuzzleAndSubmitAnswer.js', () => ({ solvePuzzleAndSubmitAnswer: jest.fn() }));

// import after mocks set up
const { getNextUnansweredPuzzle } = await import('../../src/answers.js');
const { solvePuzzleAndSubmitAnswer } = await import('../../src/actions/solvePuzzleAndSubmitAnswer.js');
const { autoSubmit } = await import('../../src/actions/autoSubmit.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('autoSubmit()', () => {
    test('does not submit if all puzzles answered', async () => {
      getNextUnansweredPuzzle.mockResolvedValue(null);
      await autoSubmit();
      expect(solvePuzzleAndSubmitAnswer).not.toHaveBeenCalled();
    });

    test('submit if has unanswered puzzle', async () => {
      const expected = { day: 1, part: 1 };
      getNextUnansweredPuzzle.mockResolvedValue(expected);
      await autoSubmit();
      expect(solvePuzzleAndSubmitAnswer).toHaveBeenCalledWith(expected.day, expected.part);
    });
  });
});
