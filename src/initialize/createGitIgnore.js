import { getConfigValue } from '../config.js';
import { copyFile } from '../io.js';
import { logger } from '../logger.js';

/**
 * Creates a gitignore file in the cwd.
 */
export const createGitIgnore = async () => {
  logger.festive('Creating .gitignore file');
  const { source, dest } = getConfigValue('paths.templates.gitignore');
  logger.debug('copying template .gitignore from: %s to: %s', source, dest);
  return copyFile(source, dest);
};
