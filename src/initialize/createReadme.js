import { outputFile } from 'fs-extra/esm';
import { readFile } from 'node:fs/promises';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import { replaceTokens } from './replaceTokens.js';

/**
 * Maps tokens strings in the template readme file to fields of the args.
 */
const tokens = [{ match: '{{year}}', key: 'year' }];

/**
 * Creates a readme file in the cwd.
 */
export const createReadme = async ({ year } = {}) => {
  logger.debug('creating README.md file');

  if (!year) {
    throw new Error('null or undefined year');
  }

  const source = getConfigValue('paths.templates.readme');
  const dest = getConfigValue('paths.readme');
  const templateFileContents = await readFile(source, { encoding: 'utf-8' });
  const readmeContents = replaceTokens(tokens, { year }, templateFileContents);

  logger.debug('saving readme file to: %s', dest);
  await outputFile(dest, readmeContents);
};
