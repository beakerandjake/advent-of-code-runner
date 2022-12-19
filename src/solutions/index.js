import { logger } from '../logger.js';
import { humanizeDuration } from '../formatting.js';
import { execute } from './solutionRunner.js';

/**
 * If start to support different "runtimes" we can add logic to conditionally export
 * solution runners. For example we could support user solutions written in different
 * languages such as python.
 */

/**
 * Runs the answer for the given day.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const solve = async (day, part, input) => {
  logger.festive('Executing solution function');

  const { answer, executionTimeNs } = await execute(day, part, input);

  logger.festive('You answered: %s (solved in %s)', answer, humanizeDuration(executionTimeNs));

  return { answer, executionTimeNs };
};
