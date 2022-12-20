import { getCorrectAnswer, answersEqual } from '../answers.js';
import { logger } from '../logger.js';
import { getFastestExecutionTime, setFastestExecutionTime } from '../statistics';

/**
 *
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {Object} executionResult
 */
export const tryToUpdateFastestExecutionTime = async (
  year,
  day,
  part,
  { answer, executionTimeNs },
) => {
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

  const fastestExecutionTime = await getFastestExecutionTime(year, day, part);

  if (executionTimeNs && (executionTimeNs >= fastestExecutionTime)) {
    logger.debug('not setting fastest execution time, %s is slower than record: %s', executionTimeNs, fastestExecutionTime);
    return;
  }

  await setFastestExecutionTime(year, day, part, executionTimeNs);
};
