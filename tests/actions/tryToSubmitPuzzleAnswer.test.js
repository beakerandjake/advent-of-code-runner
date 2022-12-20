import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockLogger, mockConfig } from '../mocks';
import { DuplicateAnswerSubmittedError, PuzzleHasBeenSolvedError } from '../../src/errors/index.js';

// setup mocks.
mockLogger();
mockConfig();

jest.unstable_mockModule('src/answers.js', () => ({
  answerHasBeenSubmitted: jest.fn(),
  puzzleHasBeenSolved: jest.fn(),
}));

jest.unstable_mockModule('src/api/index.js', () => ({
  submitSolution: jest.fn(),
}));

// import mocks after setting up mocks
const { answerHasBeenSubmitted, puzzleHasBeenSolved } = await import('../../src/answers.js');
const { submitSolution } = await import('../../src/api/index.js');
const { tryToSubmitPuzzleAnswer } = await import('../../src/actions/tryToSubmitPuzzleAnswer.js');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('tryToSubmitPuzzleAnswer()', () => {
    test('throws if puzzle has already been solved', async () => {
      puzzleHasBeenSolved.mockResolvedValue(true);
      answerHasBeenSubmitted.mockResolvedValue(false);
      await expect(async () => tryToSubmitPuzzleAnswer(1, 2, 3, 'ASDF')).rejects.toThrow(PuzzleHasBeenSolvedError);
    });

    test('throws if answer has has already been submitted', async () => {
      puzzleHasBeenSolved.mockResolvedValue(false);
      answerHasBeenSubmitted.mockResolvedValue(true);
      await expect(async () => tryToSubmitPuzzleAnswer(1, 2, 3, 'ASDF')).rejects.toThrow(DuplicateAnswerSubmittedError);
    });

    test('submits solution if can', async () => {
      const expected = [1, 2, 3, 'ASDF'];
      puzzleHasBeenSolved.mockResolvedValue(false);
      answerHasBeenSubmitted.mockResolvedValue(false);
      await tryToSubmitPuzzleAnswer(...expected);
      expect(submitSolution).toHaveBeenCalledWith(...expected, undefined);
    });
  });
});
