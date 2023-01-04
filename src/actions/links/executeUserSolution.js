import { humanizeDuration } from '../../formatting.js';
import { logger } from '../../logger.js';
import { execute } from '../../solutions/index.js';

/**
 * Execute the users code for this puzzle and output the results.
 */
export const executeUserSolution = async ({ day, part, input } = {}) => {
  logger.festive('Executing your code');
  const { answer, executionTimeNs } = await execute(day, part, input);
  logger.festive('You answered: %s (solved in %s)', answer, humanizeDuration(executionTimeNs));
  return { answer, executionTimeNs };
};
