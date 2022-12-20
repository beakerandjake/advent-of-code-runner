import {
  addIncorrectAnswer,
  answerHasBeenSubmitted,
  puzzleHasBeenSolved,
  setCorrectAnswer,
} from '../answers.js';
import { submitSolution } from '../api/mockApi.js';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import { setFastestExecutionTime } from '../statistics.js';

/**
 * Handle the fact that the submitted answer was correct.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {String} submissionMessage
 * @param {Object} solutionResult
 * @returns
 */
const onSubmissionCorrect = async (
  year,
  day,
  part,
  submissionMessage,
  { answer, executionTimeNs },
) => {
  logger.festive('%s', submissionMessage);
  return Promise.all([
    setCorrectAnswer(year, day, part, answer),
    setFastestExecutionTime(year, day, part, executionTimeNs),
  ]);
};

/**
 * Handle the fact that the submitted answer was incorrect.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {String} submissionMessage
 * @param {Object} solutionResult
 */
const onSubmissionIncorrect = async (year, day, part, submissionMessage, { answer }) => {
  logger.error('%s', submissionMessage);
  return addIncorrectAnswer(year, day, part, answer);
};

export const submitPuzzleAnswer = async (year, day, part, executionResult) => {
  // don't re-submit if user already successfully completed this puzzle.
  if (await puzzleHasBeenSolved(year, day, part)) {
    logger.festive('You\'ve already submitted the correct solution to this puzzle!');
    return;
  }

  // don't re-submit answer if user has already submitted it.
  if (await answerHasBeenSubmitted(year, day, part, executionResult.answer)) {
    logger.error('You\'ve already submitted this answer to advent of code!');
    return;
  }

  const { success, message } = await submitSolution(year, day, part, executionResult.answer, getConfigValue('aoc.authenticationToken'));

  await (
    success
      ? onSubmissionCorrect(year, day, part, message, executionResult)
      : onSubmissionIncorrect(year, day, part, message, executionResult)
  );
};
