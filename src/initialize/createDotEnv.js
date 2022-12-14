import { getConfigValue } from '../config.js';
import { loadFileContents, saveFile } from '../io.js';
import { logger } from '../logger.js';

/**
 * Each value in this array is expected to be:
 * A key on the args argument
 * Exist in the template .env file as a token surrounded by brackets
 * Each token in the env file will be replaced with the value of that key on the args object.
 * For example:
 *  args = { cats: 1234 } and template env file = CATS_VALUE={cats}
 * The resulting .env file would read: CATS_VALUE=1234
 */
const replacements = [
  'year',
  'authToken',
];

/**
 * Creates the .env file in the cwd
 * @param {Number} year
 * @param {String} authToken
 */
export const createDotEnv = async (args) => {
  logger.debug('creating .env file');

  if (!args) {
    throw new Error('Attempted to create .env file with empty args');
  }

  // ensure all replacement strings are present in the args object.
  const missingArgs = replacements.filter((key) => !args[key]);
  if (missingArgs.length > 0) {
    throw new Error(`Attempted to create .env file, but missing args: ${missingArgs.join(', ')}`);
  }

  const { source, dest } = getConfigValue('paths.templates.dotenv');

  // replace each "{TOKEN}" in the env file with the value from the args.
  const envFile = replacements.reduce(
    (acc, key) => acc.replace(`{${key}}`, args[key]),
    await loadFileContents(source),
  );

  logger.debug('saving .env file to: %s', dest);

  return saveFile(dest, envFile);
};
