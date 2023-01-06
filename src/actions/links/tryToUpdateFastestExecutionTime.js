import { logger } from '../../logger.js';
import { getPuzzlesFastestRuntime, setFastestExecutionTime } from '../../statistics.js';

/**
 * Compares the puzzles latest execution time to the fastest stored execution time.
 * If the latest time is faster that the stored, the new value will be stored.
 */
export const tryToUpdateFastestExecutionTime = async ({
  year, day, part, executionTimeNs,
} = {}) => {
  if (executionTimeNs == null) {
    throw new Error('null or undefined execution time');
  }

  if (executionTimeNs < 0) {
    throw new RangeError('execution time cannot be negative');
  }

  const fastestExecutionTime = await getPuzzlesFastestRuntime(year, day, part);

  if (fastestExecutionTime != null && executionTimeNs >= fastestExecutionTime) {
    logger.verbose('not setting fastest execution time, %s is slower than record: %s', executionTimeNs, fastestExecutionTime);
    return;
  }

  logger.festive('That\'s your fastest execution time ever for this puzzle!');
  await setFastestExecutionTime(year, day, part, executionTimeNs);
};
