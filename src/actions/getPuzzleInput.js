import { downloadInput } from '../api/index.js';
import { getConfigValue } from '../config.js';
import { inputIsCached, getCachedInput, cacheInput } from '../inputs.js';
import { logger } from '../logger.js';
import { parsePositiveInt } from '../validation/index.js';

/**
 * Returns the input for the puzzle.
 * If the input is not cached it will be downloading.
 * If the input is previously downloaded, it will be downloaded and cached.
 * @param {Number} year
 * @param {Number} day
 * @returns {Promise<String>}
 */
export const getPuzzleInput = async (year, day) => {
  logger.verbose('getting input', { year, day });
  const parsedYear = parsePositiveInt(year);
  const parsedDay = parsePositiveInt(day);
  let toReturn;

  if (!await inputIsCached(parsedYear, parsedDay)) {
    logger.festive('Downloading and caching input file');
    toReturn = await downloadInput(parsedYear, parsedDay, getConfigValue('aoc.authenticationToken'));
    await cacheInput(parsedYear, parsedDay, toReturn);
  } else {
    logger.festive('Loading cached input file');
    toReturn = await getCachedInput(parsedYear, parsedDay);
  }

  return toReturn;
};
