import { getConfigValue } from '../config.js';
import { copyFile } from '../persistence/io.js';
import { logger } from '../logger.js';

/**
 * Creates a gitignore file in the cwd.
 */
export const createGitIgnore = async () => {
  logger.debug('creating .gitignore file');
  const { source, dest } = getConfigValue('paths.templates.gitignore');
  logger.debug('copying template .gitignore from: %s to: %s', source, dest);
  await copyFile(source, dest);
};
