import {
  addIncorrectAnswer,
  answerHasBeenSubmitted,
  puzzleHasBeenSolved,
  setCorrectAnswer,
} from '../../answers.js';
import { submitSolution } from '../../api/mockApi.js';
import { getConfigValue } from '../../config.js';
import { logger } from '../../logger.js';
import { executeSolutionAndLog, getYear, puzzleIsUnlocked } from './actionUtil.js';

/**
 * Solves a specific puzzle
 */
export const submit = async (day, part) => {
  logger.festive('Submitting puzzle for day: %s, part: %s', day, part);
  const year = getYear();

  // don't submit if puzzle is locked.}
  if (await puzzleIsUnlocked(year, day, part) === false) {
    return;
  }

  // don't re-submit if user already successfully completed this puzzle.
  if (await puzzleHasBeenSolved(year, day, part)) {
    logger.festive('You\'ve already submitted the correct solution to this puzzle!');
    return;
  }

  const { answer, executionTimeNs } = await executeSolutionAndLog(day, part);

  // don't re-submit answer if user has already submitted it.
  if (await answerHasBeenSubmitted(year, day, part, answer)) {
    logger.error('You\'ve already submitted this answer to advent of code!');
    return;
  }

  logger.festive('Submitting your answer to advent of code');
  const { success, message } = await submitSolution(year, day, part, answer, getConfigValue('aoc.authenticationToken'));
  logger[success ? 'festive' : 'error']('%s', message);

  if (!success) {
    await addIncorrectAnswer(year, day, part, answer);
    return;
  }

  await Promise.all([
    setCorrectAnswer(year, day, part, answer),
    // TODO stats for execution time
  ]);
};
