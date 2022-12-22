import { humanizeDuration } from '../../formatting.js';
import { logger } from '../../logger.js';
import { executeUserSolution as execute } from '../../solutions/index.js';

/**
 * Execute the users code for this puzzle and output the results.
 * @param {Object} args
 * @param {Number} args.day
 * @param {Number} args.part
 * @param {String} args.input
 */
export const executeUserSolution = async (args = {}) => {
  logger.festive('Executing your code');
  const { day, part, input } = args;
  const { answer, executionTimeNs } = await execute(day, part, input);
  logger.festive('You answered: %s (solved in %s)', answer, humanizeDuration(executionTimeNs));
  return {
    ...args, answer, executionTimeNs,
  };
};
