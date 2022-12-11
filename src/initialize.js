import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';
import { getConfigValue } from './config.js';
import { dataFilePath } from './store.js';
import {
  appendToFile,
  copyFile, ensureDirectoriesExist, fileExists, openFile, saveFile,
} from './io.js';

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
export const createSolutionFiles = async (year) => {
  logger.festive('Creating solution files');

  const solutionDirectory = join(getConfigValue('solutions.path'), `${year}`);

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

// line to be added to .gitignore to ensure the user doesn't commit
// their authentication token to source control
const ignoreEnv = `
# dotenv environment variables file
.env
`;

/**
 * Updates the gitignore file to ignore any files used by this which should be ignored.
 * @param {String} rootDirectory - The directory containing the git ignore file.
 */
export const updateGitIgnore = async () => {
  logger.festive('Updating .gitignore to ignore .env file');

  const fileName = join(getConfigValue('rootDirectory'), '.gitignore');

  if (!await fileExists(fileName)) {
    logger.festive('No .gitnignore found, skipping. If you add a .gitignore in the future be sure to ignore the .env file so you don\'t commit your authentication token!');
    return;
  }

  const file = await openFile(fileName);
  for await (const line of file.readLines()) {
    if (line === '.env') {
      logger.festive('Skipping update, .gitignore file already ignores .env!');
      return;
    }
  }

  await appendToFile(fileName, ignoreEnv);

  logger.festive('Successfully updated .gitignore');
};

/**
 * Adds the users authentication token to the .env file.
 * @param {String} token
 */
export const addTokenToEnv = async (token) => {
  logger.festive('Adding authentication token to .env file');
  logger.warn('not implemented - addTokenToEnv()');
};

/**
 * Creates the Data File if it does not already exist.
 */
export const createDataFile = async () => {
  logger.festive('Creating Data file.');
  if (!await fileExists(dataFilePath)) {
    logger.festive('Data file already exists.');
    return;
  }
  await saveFile(dataFilePath, JSON.stringify({}));
};
