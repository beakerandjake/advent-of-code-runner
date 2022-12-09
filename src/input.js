import { join } from 'path';
import { logger } from './logger.js';
import { getConfigValue } from './config.js';
import { fileExists, loadFileContents, saveFile } from './io.js';
import { downloadInput } from './api.js';

/**
   * Returns the file name for the input file for the given year and day
   * @param {Number} year
   * @param {Number} day
   */
const getInputFileName = (year, day) => join(getConfigValue('inputs.path'), `${year}_${day}.txt`);

/**
   * Saves the input to a file in the cwd with pattern "/inputs/{year}_{day}.txt"
   * If the file already exists it will be overwritten.
   * @param {Number} year
   * @param {Number} day
   */
const saveInputToFile = async (year, day, input) => {
  logger.verbose('saving input for year: %s, day: %s', year, day);
  return saveFile(getInputFileName(year, day), input);
};

/**
 * Checks to see if an input file has already been created for that days puzzle.
 * @param {Number} year
 * @param {Number} day
 */
const inputFileExits = async (year, day) => {
  logger.verbose('checking if input file exists for year: %s, day: %s', year, day);
  return fileExists(getInputFileName(year, day));
};

/**
   * Loads the input file for the days puzzle.
   * @param {Number} year
   * @param {Promise<String>} day
   */
const loadInputFile = async (year, day) => {
  logger.verbose('loading cached input for year: %s, day: %s', year, day);
  return loadFileContents(getInputFileName(year, day));
};

/**
 * Returns the downloaded input file (if exists)
 * If the input file has now been downloaded
 * it will be downloaded and saved to disk for future use.
 * @param {Number} year
 * @param {Number} day
 */
export const getInputFileContents = async (year, day) => {
  let toReturn;

  if (!await inputFileExits(year, day)) {
    toReturn = await downloadInput(year, day, getConfigValue('aoc.authenticationToken'));
    await saveInputToFile(year, day);
  } else {
    toReturn = await loadInputFile(year, day);
  }

  return toReturn;
};
