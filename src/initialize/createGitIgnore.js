import { copy } from 'fs-extra/esm';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';

/**
 * Creates a gitignore file in the cwd.
 */
export const createGitIgnore = async () => {
  logger.debug('creating .gitignore file');
  const { source, dest } = getConfigValue('paths.templates.gitignore');
  logger.debug('copying template .gitignore from: %s to: %s', source, dest);
  await copy(source, dest);
};
