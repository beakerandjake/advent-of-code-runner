import { logger } from '../../logger.js';
import { setFastestExecutionTime as doSetFastestExecutionTime } from '../../statistics.js';

/**
 * Update the fastest execution time for this puzzle with the new value.
 */
export const storeFastestExecutionTime = async ({
  year, day, part, executionTimeNs,
} = {}) => {
  logger.debug('setting fastest execution time to: %s', executionTimeNs);
  await doSetFastestExecutionTime(year, day, part, executionTimeNs);
};
