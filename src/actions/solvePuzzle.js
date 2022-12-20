import { answersEqual, getCorrectAnswer } from '../answers.js';
import { logger } from '../logger.js';
import { getYear, puzzleIsUnlocked } from './actionUtil.js';
import { getInputAndExecuteSolution } from './getInputAndExecuteSolution.js';
import { tryToUpdateFastestExecutionTime } from './tryToUpdateFastestExecutionTime.js';

/**
 * Checks to see if this puzzle has already been solved by the user
 * and that the current answer is equal to the correct answer.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {String|Number} answer
 */
const answerIsCorrectAnswer = async (year, day, part, answer) => {
  // check to see if the user has correctly submitted an answer to this puzzle.
  const correctAnswer = await getCorrectAnswer(year, day, part);

  // bail if user has not previously submitted a correct answer.
  if (!correctAnswer) {
    return false;
  }

  if (!answersEqual(answer, correctAnswer)) {
    // the user might have already submitted the correct answer to this problem
    // but are re-executing their solution because they made code or performance improvements.
    // let them know their changes might have broke something.
    logger.error('You have already correctly answered this puzzle, but answer: "%s" doesn\'t match correct answer: "%s"', answer, correctAnswer);
    return false;
  }

  return true;
};

/**
 * Solve the specified puzzle.
 * @param {Number} day
 * @param {Number} part
 */
export const solvePuzzle = async (day, part) => {
  logger.festive('Solving puzzle for day: %s, part: %s', day, part);
  const year = getYear();

  // cant solve locked puzzle.
  if (await puzzleIsUnlocked(year, day, part) === false) {
    return;
  }

  const { answer, executionTimeNs } = await getInputAndExecuteSolution(day, part);

  // only update statistics if they are re-solved a puzzle they have already completed.
  if (!await answerIsCorrectAnswer(year, day, part, answer)) {
    return;
  }

  await tryToUpdateFastestExecutionTime(year, day, part, executionTimeNs);
};
