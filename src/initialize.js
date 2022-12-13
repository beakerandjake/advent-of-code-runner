import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { EOL } from 'os';
import { logger } from './logger.js';
import { envOptions, getConfigValue } from './config.js';
import { dataFilePath, defaultDataStoreContents } from './store.js';
import {
  appendToFile,
  copyFile,
  ensureDirectoriesExist,
  fileExists,
  openFile,
  saveFile,
} from './io.js';

/**
 * Copies the template solution file to the destination file.
 * If the destination file already exists, creation will be skipped.
 * @param {String} templateSolutionPath
 * @param {String} destFilePath
 */
const createSolutionFile = async (templateSolutionPath, destFilePath) => {
  logger.debug('creating solution file: %s', destFilePath);
  await copyFile(templateSolutionPath, destFilePath);
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

  logger.festive('Successfully created %s solution files', results.length);
};

/**
 * Updates the gitignore file to ignore any files used by this which should be ignored.
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

  await appendToFile(fileName, ['', '# dotenv environment variables file', '.env'].join(EOL));

  logger.festive('Successfully updated .gitignore');
};

/**
 * Creates the .env file which helps configure advent-of-code-runner.
 * @param {String} token
 */
export const createEnvFile = async (authenticationToken, year) => {
  logger.festive('Adding authentication token to .env file');

  const fileName = join(getConfigValue('rootDirectory'), '.env');
  const contents = [
    `${envOptions.authenticationToken}=${authenticationToken}`,
    `${envOptions.year}=${year}`,
  ].join(EOL);

  await saveFile(fileName, contents);

  logger.festive('Successfully created .env file');
};

/**
 * Creates the Data File if it does not already exist.
 */
export const createDataFile = async () => {
  logger.festive('Creating Data file to store your progress');

  await saveFile(dataFilePath, JSON.stringify(defaultDataStoreContents));

  logger.festive('Successfully created Data File');
};

/**
 * Checks to see if a package.json file exists in the cwd.
 */
export const packageJsonExists = async () => {
  const filePath = join(getConfigValue('rootDirectory'), 'package.json');
  logger.debug('checking if package.json file exists at: %s', filePath);
  const toReturn = await fileExists(filePath);
  logger.debug('found package.json? %s', toReturn);
  return toReturn;
};
