import { join } from 'path';
import { logger } from './logger.js';
import { getConfigValue } from './config.js';
import { fileExists, loadFileContents, saveFile } from './io.js';

/**
 * Returns the file name for the input file for the given year and day
 * @param {Number} year
 * @param {Number} day
 */
const getInputFileName = (year, day) => join(getConfigValue('inputs.path'), `${year}_${day}.txt`);

/**
 * Caches the input so it can be re-used without re-downloading
 * @param {Number} year
 * @param {Number} day
 */
export const cacheInput = async (year, day, input) => {
  logger.verbose('caching input for year: %s, day: %s', year, day);
  return saveFile(getInputFileName(year, day), input);
};

/**
 * Checks to see if the input for the days puzzle has been cached
 * @param {Number} year
 * @param {Number} day
 */
export const inputIsCached = async (year, day) => {
  logger.debug('checking if input is cached for year: %s, day: %s', year, day);
  return fileExists(getInputFileName(year, day));
};

/**
 * Loads the cached input for the days puzzle
 * @param {Number} year
 * @param {Number} day
 */
export const getCachedInput = async (year, day) => {
  logger.verbose('loading cached input for year: %s, day: %s', year, day);
  return loadFileContents(getInputFileName(year, day));
};
