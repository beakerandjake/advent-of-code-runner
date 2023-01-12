import { setPuzzlesFastestRuntime } from '../statistics.js';

/**
 * Update the fastest execution time for this puzzle with the new value.
 */
export const storeFastestRuntime = async ({
  year, day, level, runtimeNs,
} = {}) => {
  if (runtimeNs == null) {
    throw new Error('null or undefined execution time');
  }

  await setPuzzlesFastestRuntime(year, day, level, runtimeNs);
};
