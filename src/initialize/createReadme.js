import { copy } from 'fs-extra/esm';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';

/**
 * Creates a readme file in the cwd.
 */
export const createReadme = async () => {
  logger.debug('creating README.md file');
  const { source, dest } = getConfigValue('paths.templates.readme');
  logger.debug('copying template readme from: %s to: %s', source, dest);
  await copy(source, dest);
};
