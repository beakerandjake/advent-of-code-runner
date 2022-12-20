import { answersEqual, getCorrectAnswer } from '../answers.js';
import { logger } from '../logger.js';
import { getYear, puzzleIsUnlocked } from './actionUtil.js';
import { executeUserSolution } from './executeUserSolution.js';
import { tryToUpdateFastestExecutionTime } from './tryToUpdateFastestExecutionTime.js';

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

  // run the users code.
  const { answer, executionTimeNs } = await executeUserSolution(day, part);

  // check to see if the user has correctly submitted an answer to this puzzle.
  const correctAnswer = await getCorrectAnswer(year, day, part);

  // bail if user has not previously submitted a correct answer.
  if (!correctAnswer) {
    return;
  }

  // the user might have already submitted the correct answer to this problem
  // but are re-executing their solution because they made code or performance improvements.
  // let them know their changes might have broke something.
  if (!answersEqual(answer, correctAnswer)) {
    logger.error('You have already correctly answered this puzzle, but answer: "%s" doesn\'t match correct answer: "%s"', answer, correctAnswer);
    return;
  }

  // attempt to update statistics for this puzzle.
  await tryToUpdateFastestExecutionTime(year, day, part, executionTimeNs);
};
