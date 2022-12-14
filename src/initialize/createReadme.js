import { getConfigValue } from '../config.js';
import { copyFile } from '../io.js';
import { logger } from '../logger.js';

/**
 * Creates a readme file in the cwd.
 */
export const createReadme = async () => {
  logger.festive('Creating README.md file');
  const { source, dest } = getConfigValue('paths.templates.readme');
  logger.debug('copying template readme from: %s to: %s', source, dest);
  return copyFile(source, dest);
};
