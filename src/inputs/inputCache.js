import { outputFile, pathExists } from 'fs-extra/esm';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';

/**
 * Returns the file name for the input file for the given year and day
 * @param {Number} year
 * @param {Number} day
 * @private
 */
const getInputFileName = (year, day) =>
  join(
    getConfigValue('paths.inputsDir'),
    `${year}_${day.toString().padStart(2, '0')}.txt`
  );

/**
 * Caches the input so it can be re-used without re-downloading
 * @param {Number} year
 * @param {Number} day
 */
export const cacheInput = async (year, day, input) => {
  const fileName = getInputFileName(year, day);
  logger.debug('saving input to: %s', fileName);
  await outputFile(fileName, input);
};

/**
 * Checks to see if the input for the days puzzle has been cached
 * @param {Number} year
 * @param {Number} day
 */
export const inputIsCached = async (year, day) => {
  const fileName = getInputFileName(year, day);
  logger.debug('checking if input file is cached at: %s', fileName);
  return pathExists(fileName);
};

/**
 * Loads the cached input for the days puzzle
 * @param {Number} year
 * @param {Number} day
 */
export const getCachedInput = async (year, day) => {
  const fileName = getInputFileName(year, day);
  logger.debug('loading cached input file: %s', fileName);
  return readFile(fileName, { encoding: 'utf-8' });
};
