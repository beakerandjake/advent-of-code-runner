import { humanizeDuration } from './formatting.js';
import { logger } from './logger.js';
import { execute } from './solutionRunner.js';

/**
 * Runs the answer for the given day.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const solve = async (year, day, part, input) => {
  logger.verbose('execution solution', { year, day, part });
  logger.festive('Executing solution function');

  const { answer, executionTimeNs } = await execute(year, day, part, input);

  logger.festive('You answered: %s (solved in %s)', answer, humanizeDuration(executionTimeNs));

  return { answer, executionTimeNs };
};
