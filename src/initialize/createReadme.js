import { getConfigValue } from '../config.js';
import { copyFile } from '../io.js';
import { logger } from '../logger.js';

/**
 * Creates a readme file in the cwd.
 */
export const createReadme = async () => {
  logger.debug('creating readme file');
  const { source, dest } = getConfigValue('paths.templates.readme');
  logger.debug('copying template readme from: %s to: %s', source, dest);
  copyFile(source, dest);
};
