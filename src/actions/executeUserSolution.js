import { getConfigValue } from '../config.js';
import { humanizeDuration } from '../formatting.js';
import { logger } from '../logger.js';
import { execute } from '../solutions/index.js';

/**
 * Execute the users code for this puzzle and output the results.
 */
export const executeUserSolution = async ({ day, level, input } = {}) => {
  if (input == null) {
    throw new Error('null or undefined input');
  }

  logger.festive('Executing your code');

  const timeout = setTimeout(() => {
    logger.festive('Your code is still running, press Ctrl+C to cancel...');
  }, getConfigValue('solutionRunner.cancelMessageDelayMs'));

  const { answer, executionTimeNs } = await execute(day, level, input);

  clearTimeout(timeout);

  logger.festive('You answered: %s (solved in %s)', answer, humanizeDuration(executionTimeNs));
  return { answer, runtimeNs: executionTimeNs };
};
