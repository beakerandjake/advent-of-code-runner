import {
  writeFile, mkdir, access, readFile,
} from 'fs/promises';
import { cwd } from 'process';
import { join, dirname } from 'path';
import { logger } from './logger.js';
import { sizeOfStringInKb } from './utils.js';

const INPUTS_FOLDER = join(cwd(), 'inputs');
const SOLUTIONS_FOLDER = join(cwd(), 'solutions');

/**
 * Returns the file name for the input file for the given year and day
 * @param {Number} year
 * @param {Number} day
 */
const getInputFileName = (year, day) => join(INPUTS_FOLDER, `${year}_${day}.txt`);

/**
 * Returns the file name for a solution file for the given year and day.
 * @param {Number} year
 * @param {Number} day
 */
export const getSolutionFileName = (year, day) => join(SOLUTIONS_FOLDER, `${year}`, `day_${day}.js`);

/**
 * Recursively creates all directories which do not exist. Existing directories will be skipped.
 * @param {String} fileName
 */
export const ensureDirectoriesExist = async (fileName) => {
  const directory = dirname(fileName);
  logger.debug('ensuring directories exists: %s', directory);
  await mkdir(directory, { recursive: true });
};

/**
 * Saves the input to a file in the cwd with pattern "/inputs/{year}_{day}.txt"
 * If the file already exists it will be overwritten.
 * @param {Number} year
 * @param {Number} day
 */
export const saveInputToFile = async (year, day, input) => {
  const fileName = getInputFileName(year, day);
  logger.verbose('saving input for year: %s, day: %s at: %s', year, day, fileName);
  await ensureDirectoriesExist(fileName);
  await writeFile(fileName, input);
  logger.debug('successfully wrote input file');
};

/**
 * Checks to see if an input file has already been created for that days puzzle.
 * @param {Number} year
 * @param {Number} day
 */
export const inputFileExits = async (year, day) => {
  logger.verbose('checking if input file exists for year: %s, day: %s', year, day);

  try {
    await access(getInputFileName(year, day));
    logger.debug('input file exists');
    return true;
  } catch (error) {
    logger.debug('input file does not exist');
    return false;
  }
};

/**
 * Loads the input file for the days puzzle.
 * @param {Number} year
 * @param {Promise<String>} day
 */
export const loadInputFile = async (year, day) => {
  const fileName = getInputFileName(year, day);
  logger.verbose('loading input for year: %s, day: %s at: %s', year, day, fileName);
  const text = (await readFile(fileName)).toString();
  logger.debug('loaded input file of size: %skb', sizeOfStringInKb(text));
  return text;
};
