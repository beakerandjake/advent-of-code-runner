import { logger } from '../logger.js';
import { getFastestExecutionTime, setFastestExecutionTime } from '../statistics';

/**
 *
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {Object} executionResult
 */
export const tryToUpdateFastestExecutionTime = async (year, day, part, executionTimeNs) => {
  const fastestExecutionTime = await getFastestExecutionTime(year, day, part);

  if (executionTimeNs && (executionTimeNs >= fastestExecutionTime)) {
    logger.debug('not setting fastest execution time, %s is slower than record: %s', executionTimeNs, fastestExecutionTime);
    return;
  }

  await setFastestExecutionTime(year, day, part, executionTimeNs);
};
