import { logger } from '../logger.js';
import { dataFileExists } from '../validation/userFilesExist.js';

/**
 * Asserts that the user has ran an init command in the cwd.
 */
export const assertInitialized = async () => {
  /**
   * it's probably enough to check if the data store file exists
   * not worth it to check packages installed or src files exist etc.
   * we can be pretty sure they have ran init if the data store file is there.
   */
  if (!(await dataFileExists())) {
    logger.error(
      'This directory does not appear to have been initialized. Please run the "init" command.'
    );
    return false;
  }

  return true;
};
