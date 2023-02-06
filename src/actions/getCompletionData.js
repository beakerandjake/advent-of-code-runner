import { logger } from '../logger.js';
import { getPuzzleCompletionData } from '../statistics.js';

/**
 * Loads the data of the users progress for the year.
 * Halts the chain if there is no data.
 */
export const getCompletionData = async ({ year } = {}) => {
  if (year == null) {
    throw new Error('null or undefined year');
  }
  const completionData = await getPuzzleCompletionData(year);

  if (completionData.length === 0) {
    logger.festive('You have not submitted any puzzles yet, please run this command after submitting a puzzle');
    return false;
  }

  return { completionData };
};
