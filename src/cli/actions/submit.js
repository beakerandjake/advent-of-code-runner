import { puzzleHasBeenSolved } from '../../answers.js';
import { logger } from '../../logger.js';
import { executeSolutionAndLog, getYear, puzzleIsUnlocked } from './actionUtil.js';

/**
 * Solves a specific puzzle
 */
export const submit = async (day, part) => {
  logger.festive('Submitting puzzle for day: %s, part: %s', day, part);
  const year = getYear();

  if (await puzzleIsUnlocked(year, day, part) === false) {
    return;
  }

  if (await puzzleHasBeenSolved(year, day, part)) {
    logger.festive('You\'ve already submitted a correct solution to this puzzle!');
    return;
  }

  const { answer, executionTimeNs } = await executeSolutionAndLog(day, part);
};
