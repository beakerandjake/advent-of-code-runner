import { logger } from '../logger.js';
import { getPuzzlesFastestRuntime, setPuzzlesFastestRuntime } from '../statistics.js';

/**
 * Compares the puzzles latest runtime to the fastest stored runtime.
 * If the latest time is faster that the stored, the new value will be stored.
 */
export const tryToUpdateFastestRuntime = async ({ year, day, level, runtimeNs } = {}) => {
  if (runtimeNs == null) {
    throw new Error('null or undefined runtime');
  }

  if (runtimeNs < 0) {
    throw new RangeError('runtime cannot be negative');
  }

  const fastestRuntime = await getPuzzlesFastestRuntime(year, day, level);

  if (fastestRuntime != null && runtimeNs >= fastestRuntime) {
    logger.verbose(
      'not setting fastest runtime, %s is slower than record: %s',
      runtimeNs,
      fastestRuntime
    );
    return false;
  }

  logger.festive("That's your fastest runtime ever for this puzzle!");
  await setPuzzlesFastestRuntime(year, day, level, runtimeNs);
  return true;
};
