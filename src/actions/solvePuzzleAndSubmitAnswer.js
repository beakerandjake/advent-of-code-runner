import { addIncorrectAnswer, setCorrectAnswer } from '../answers.js';
import { logger } from '../logger.js';
import { setFastestExecutionTime } from '../statistics.js';
import { getYear, puzzleIsUnlocked } from './actionUtil.js';
import { getInputAndExecuteSolution } from './getInputAndExecuteSolution.js';
import { tryToSubmitPuzzleAnswer } from './tryToSubmitPuzzleAnswer.js';

/**
 * Store the fact that the submitted answer was correct.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {Object} executionResult
 */
const onAnswerCorrect = async (year, day, part, message, { answer, executionTimeNs }) => {
  logger.festive('%s', message);
  await setCorrectAnswer(year, day, part, answer);
  await setFastestExecutionTime(year, day, part, executionTimeNs);
};

/**
 * Store the fact that the submitted answer was incorrect.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {Object} executionResult
 */
const onAnswerIncorrect = async (year, day, part, message, { answer }) => {
  logger.error('%s', message);
  return addIncorrectAnswer(year, day, part, answer);
};

/**
 * Submit the answer for the specified puzzle.
 * @param {Number} day
 * @param {Number} part
 */
export const solvePuzzleAndSubmitAnswer = async (day, part) => {
  const year = getYear();

  // can't submit a locked puzzle
  if (await puzzleIsUnlocked(year, day, part) === false) {
    return;
  }

  const { answer, executionTimeNs } = await getInputAndExecuteSolution(day, part);
  const { success, message } = await tryToSubmitPuzzleAnswer(year, day, part, answer);

  await (
    success
      ? onAnswerCorrect(year, day, part, message, { answer, executionTimeNs })
      : onAnswerIncorrect(year, day, part, message, { answer, executionTimeNs })
  );
};
