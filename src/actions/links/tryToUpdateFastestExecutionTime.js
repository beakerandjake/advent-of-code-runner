import { logger } from '../../logger.js';
import { getFastestExecutionTime, setFastestExecutionTime } from '../../statistics.js';

/**
 * Compares the puzzles latest execution time to the fastest stored execution time.
 * If the latest time is faster that the stored, the new value will be stored.
 */
export const tryToUpdateFastestExecutionTime = async ({
  year, day, part, executionTimeNs,
}) => {
  const fastestExecutionTime = await getFastestExecutionTime(year, day, part);

  if (executionTimeNs && (executionTimeNs >= fastestExecutionTime)) {
    logger.debug('not setting fastest execution time, %s is slower than record: %s', executionTimeNs, fastestExecutionTime);
    return;
  }

  logger.festive('That\'s your fastest execution time ever for this puzzle!');
  await setFastestExecutionTime(year, day, part, executionTimeNs);
};
