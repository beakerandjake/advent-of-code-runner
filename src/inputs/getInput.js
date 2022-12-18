import { downloadInput } from '../api/index.js';
import { getConfigValue } from '../config.js';
import { inputIsCached, getCachedInput, cacheInput } from './inputCache.js';
import { logger } from '../logger.js';

/**
 * Returns the input for the puzzle.
 * If the input is not cached it will be downloading.
 * If the input is previously downloaded, it will be downloaded and cached.
 * @param {Number} year
 * @param {Number} day
 * @returns {Promise<String>}
 */
export const getInput = async (year, day) => {
  logger.verbose('getting input', { year, day });

  let toReturn;

  if (!await inputIsCached(year, day)) {
    logger.festive('Downloading and caching input file');
    toReturn = await downloadInput(year, day, getConfigValue('aoc.authenticationToken'));
    await cacheInput(year, day, toReturn);
  } else {
    logger.festive('Loading cached input file');
    toReturn = await getCachedInput(year, day);
  }

  return toReturn;
};
