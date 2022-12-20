import { answerHasBeenSubmitted, puzzleHasBeenSolved } from '../answers.js';
import { submitSolution } from '../api/index.js';
import { getConfigValue } from '../config.js';
import { DuplicateAnswerSubmittedError, PuzzleHasBeenSolvedError } from '../errors/index.js';
import { logger } from '../logger.js';

/**
 * Attempts to submit the answer to advent of code.
 * Adds logic to ensure that duplicate answers are not submitted.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {Number|String} answer
 * @throws {PuzzleHasBeenSolvedError}
 * @throws {DuplicateAnswerSubmittedError}
 */
export const tryToSubmitPuzzleAnswer = async (year, day, part, answer) => {
  logger.festive('Submitting your answer to advent of code');

  // don't re-submit if user already successfully completed this puzzle.
  if (await puzzleHasBeenSolved(year, day, part)) {
    throw new PuzzleHasBeenSolvedError();
  }

  // don't re-submit answer if user has already submitted it.
  if (await answerHasBeenSubmitted(year, day, part, answer)) {
    throw new DuplicateAnswerSubmittedError();
  }

  return submitSolution(year, day, part, answer, getConfigValue('aoc.authenticationToken'));
};
