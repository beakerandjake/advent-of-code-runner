import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';
import { getConfigValue } from './config.js';
import { copyFile, ensureDirectoriesExist, fileExists } from './io.js';

/**
 * Copies the template solution file to the destination file.
 * If the destination file already exists, creation will be skipped.
 * @param {String} templateSolutionPath
 * @param {String} destFilePath
 */
const createSolutionFile = async (templateSolutionPath, destFilePath) => {
  if (await fileExists(destFilePath)) {
    logger.debug('skipping creation of existing solution file: %s', destFilePath);
    return false;
  }

  logger.debug('creating solution file: %s', destFilePath);

  await copyFile(templateSolutionPath, destFilePath);

  return true;
};

/**
 * Creates solution files for each day of the years advent of code.
 * Existing files will be skipped and not overwritten.
 * @param {String} rootDirectory - The directory to create the files in.
 * @param {Number} year - The year to create solution files for.
 */
export const createSolutionFiles = async (rootDirectory, year) => {
  logger.festive('Creating solution files');

  const solutionDirectory = join(rootDirectory, `${year}`);

  await ensureDirectoriesExist(solutionDirectory);

  const solutionFileNames = getConfigValue('aoc.puzzleValidation.days').map(
    (day) => join(solutionDirectory, `day_${day}.js`),
  );

  const templateSolutionPath = join(
    dirname(fileURLToPath(import.meta.url)),
    'templateSolution.js',
  );

  const results = await Promise.all(
    solutionFileNames.map((fileName) => createSolutionFile(templateSolutionPath, fileName)),
  );

  const creationCount = results.filter(Boolean).length;

  logger.festive('Created %s solution files, skipped %s existing files', creationCount, results.length - creationCount);
};
