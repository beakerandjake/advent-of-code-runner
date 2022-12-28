import { getConfigValue } from '../config.js';
import { loadFileContents, saveFile } from '../persistence/io.js';
import { logger } from '../logger.js';
import { replaceTokens } from './replaceTokens.js';

/**
 * Maps tokens strings in the template env file to fields of the args.
 */
const envFileTokens = [
  { match: '{{authToken}}', key: 'authToken' },
];

/**
 * Creates the .env file in the cwd
 * @param {Number} year
 * @param {String} authToken
 */
export const createDotEnv = async ({ authToken }) => {
  logger.debug('creating .env file');

  if (!authToken) {
    throw new Error('Attempted to create .env file with empty auth token');
  }

  const { source, dest } = getConfigValue('paths.templates.dotenv');

  // replace each token in the template env file with the arg values
  const envFile = replaceTokens(
    envFileTokens,
    { authToken },
    await loadFileContents(source),
  );

  logger.debug('saving .env file to: %s', dest);

  await saveFile(dest, envFile);
};
