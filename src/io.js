import { writeFile, mkdir } from 'fs/promises';
import { logger } from './logger.js';
import { cwd } from 'process';
import { join, dirname } from 'path';

const INPUTS_FOLDER = join(cwd(), 'inputs');

/**
 * Returns the file name for the given year and day
 * @param {Number} year
 * @param {Number} day
 * @returns {String}
 */
const getFileName = (year, day) =>
  join(INPUTS_FOLDER, `${year}`, `day_${day}.txt`);

/**
 * Recursively creates all directories which do not exist. Existing directories will be skipped.
 * @param {String} fileName 
 */
const ensureDirectoriesExist = async (fileName) => {
  const directory = dirname(fileName);

  logger.debug('ensuring directories exists: %s', directory);

  await mkdir(directory, { recursive: true });
};

/**
 * Creates a file in the cwd with pattern "/{year}/day/day_{day}.txt"
 * If the file already exists it will be overwritten.
 * @param {Number} year
 * @param {Number} day
 * @param {String} input - The content to write to the file
 */
export const saveInputToFile = async (year, day, input) => {
  const fileName = getFileName(year, day);

  logger.info('saving input for year: %s, day: %s at: %s', year, day, fileName);

  await ensureDirectoriesExist(fileName);
  
  logger.info('dirname %s', dirname(fileName));

  await writeFile(fileName, input);
};
