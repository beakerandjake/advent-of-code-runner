import { copy } from 'fs-extra/esm';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';

/**
 * Creates a readme file in the cwd.
 */
export const createReadme = async () => {
  logger.debug('creating README.md file');
  const source = getConfigValue('paths.templates.readme');
  const dest = getConfigValue('paths.readme');
  logger.debug('copying template readme from: %s to: %s', source, dest);
  await copy(source, dest);
};
