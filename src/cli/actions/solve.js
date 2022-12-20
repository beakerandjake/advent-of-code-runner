import { answersEqual, getCorrectAnswer } from '../../answers.js';
import { logger } from '../../logger.js';
import { tryToSetFastestExecutionTime } from '../../statistics.js';
import { executeSolutionAndLog, getYear, puzzleCanBeSolved } from './actionUtil.js';

/**
 * Solves a specific puzzle
 */
export const solve = async (day, part) => {
  logger.festive('Solving puzzle for day: %s, part: %s', day, part);
  const year = getYear();

  if (await puzzleCanBeSolved(year, day, part) === false) {
    return;
  }
  const { answer, executionTimeNs } = await executeSolutionAndLog(day, part);

  // the user might have already submitted the correct answer to this problem
  // but are re-executing their solution because they made code or performance improvements.
  const correctAnswer = await getCorrectAnswer(year, day, part);

  // the user has not previously submitted a correct answer.
  if (!correctAnswer) {
    return;
  }

  // the current answer is not the correct answer.
  // the user could have changed code and broke something.
  if (!answersEqual(answer, correctAnswer)) {
    logger.error('You have already correctly answered this puzzle, but answer: "%s" doesn\'t match correct answer: "%s"', answer, correctAnswer);
    return;
  }

  // the current answer is correct, see if the user broke a performance record.
  logger.festive('You have already correctly answered this puzzle');
  await tryToSetFastestExecutionTime(year, day, part, executionTimeNs);
};
