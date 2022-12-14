import { getConfigValue } from '../config.js';
import { loadFileContents, saveFile } from '../io.js';
import { logger } from '../logger.js';

/**
 * Creates the .env file in the cwd
 * @param {Number} year
 * @param {String} authToken
 */
export const createDotEnv = async (year, authToken) => {
  logger.debug('creating .env file');

  if (!year) {
    throw new Error('Attempted to create .env file with null year');
  }

  if (!authToken) {
    throw new Error('Attempted to create .env file with null auth token');
  }

  const { source, dest } = getConfigValue('paths.templates.dotenv');

  // todo, if more value keep getting added then will want a better way of replacing
  // probably something that can run in a reduce method.
  let envContents = await loadFileContents(source);
  envContents = envContents.replace('{authToken}', authToken);
  envContents = envContents.replace('{year}', year);

  logger.debug('saving .env file to: %s', dest);

  return saveFile(dest, envContents);
};
