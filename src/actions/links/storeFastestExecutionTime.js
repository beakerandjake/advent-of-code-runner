import { setFastestExecutionTime as doSetFastestExecutionTime } from '../../statistics.js';

/**
 * Update the fastest execution time for this puzzle with the new value.
 */
export const storeFastestExecutionTime = async ({
  year, day, part, executionTimeNs,
} = {}) => {
  if (executionTimeNs == null) {
    throw new Error('null or undefined execution time');
  }

  await doSetFastestExecutionTime(year, day, part, executionTimeNs);
};
