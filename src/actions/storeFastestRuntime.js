import { setPuzzlesFastestRuntime } from '../statistics.js';

/**
 * Update the fastest runtime for this puzzle with the new value.
 */
export const storeFastestRuntime = async ({
  year, day, level, runtimeNs,
} = {}) => {
  if (runtimeNs == null) {
    throw new Error('null or undefined runtime');
  }

  await setPuzzlesFastestRuntime(year, day, level, runtimeNs);
};
