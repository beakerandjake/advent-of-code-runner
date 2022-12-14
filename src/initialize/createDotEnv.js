import { getConfigValue } from '../config.js';
import { loadFileContents, saveFile } from '../io.js';
import { logger } from '../logger.js';
import { replaceTokens } from './replaceTokens.js';

/**
 * Maps tokens strings in the template env file to fields of the args.
 */
const envFileTokens = [
  { match: '{{year}}', key: 'year' },
  { match: '{{authToken}}', key: 'authToken' },
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

  const { source, dest } = getConfigValue('paths.templates.dotenv');

  // replace each token in the template env file with the arg values
  const envFile = replaceTokens(
    envFileTokens,
    args,
    await loadFileContents(source),
  );

  logger.debug('saving .env file to: %s', dest);

  return saveFile(dest, envFile);
};
