import { readmeExists } from '../validation/userFilesExist.js';
import { logger } from '../logger.js';

/**
 * Returns true if a README file exists in the cwd.
 */
export const assertReadmeExists = async () => {
  if (!await readmeExists()) {
    logger.error('Could not find README file in your repository. This file should have been created by the "init" command');
    return false;
  }
  return true;
};
