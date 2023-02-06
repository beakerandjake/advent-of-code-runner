import { outputFile } from 'fs-extra/esm';
import { readFile } from 'node:fs/promises';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import { replaceTokens } from './replaceTokens.js';

/**
 * Maps tokens strings in the template env file to fields of the args.
 */
const envFileTokens = [{ match: '{{authToken}}', key: 'authToken' }];

/**
 * Creates the .env file in the cwd
 * @param {Number} year
 * @param {String} authToken
 */
export const createDotEnv = async ({ authToken } = {}) => {
  logger.debug('creating .env file');

  if (!authToken) {
    throw new Error('Attempted to create .env file with empty auth token');
  }

  const { source, dest } = getConfigValue('paths.templates.dotenv');
  const templateEnvFileContents = await readFile(source, { encoding: 'utf-8' });
  const envFile = replaceTokens(envFileTokens, { authToken }, templateEnvFileContents);
  logger.debug('saving .env file to: %s', dest);
  await outputFile(dest, envFile);
};
