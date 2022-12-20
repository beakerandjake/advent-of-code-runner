import { getPuzzleInput } from './getPuzzleInput.js';
import { humanizeDuration } from '../formatting.js';
import { logger } from '../logger.js';
import { executeUserSolution } from '../solutions/index.js';

/**
 * Gets the puzzles input and executes the users solution.
 * @param {Number} day
 * @param {Number} part
 * @param {Number} input
 */
export const getInputAndExecuteSolution = async (day, part) => {
  const input = await getPuzzleInput();
  logger.festive('Executing your code');
  const { answer, executionTimeNs } = await executeUserSolution(day, part, input);
  logger.festive('You answered: %s (solved in %s)', answer, humanizeDuration(executionTimeNs));
  return { answer, executionTimeNs };
};
