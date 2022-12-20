import { getPuzzleInput } from './getPuzzleInput.js';
import { humanizeDuration } from '../formatting.js';
import { logger } from '../logger.js';

/**
 * Executes the users solution and logs the result.
 * @param {Number} day
 * @param {Number} part
 * @param {Number} input
 */
export const executeUserSolution = async (day, part) => {
  const input = await getPuzzleInput();
  logger.festive('Executing your code');
  const { answer, executionTimeNs } = await executeUserSolution(day, part, input);
  logger.festive('You answered: %s (solved in %s)', answer, humanizeDuration(executionTimeNs));
  return { answer, executionTimeNs };
};
