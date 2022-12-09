import { logger } from './logger.js';
import { execute } from './solutionRunner.js';

/**
 * Runs the solution for the given day.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const solve = async (year, day, part, input) => {
  logger.verbose('running solution for year: %s, day: %s, part: %s', year, day, part);

  // todo download file or load cached.

  return execute(year, day, part, input);
};
