import { logger } from '../../logger.js';
import { userDataFileExists } from '../../persistence/jsonFileStore.js';

/**
 * Asserts that the user has ran an init command in the cwd.
 */
export const assertInitialized = async () => {
  /**
   * it's probably enough to check if the data store file exists
   * not worth it to check packages installed or src files exist etc.
   * we can be pretty sure they have ran init if the data store file is there.
   */
  if (!await userDataFileExists()) {
    logger.error('This directory does not appear to have been initialized. Please run the "init" command.');
    return false;
  }

  logger.debug('cwd is initialized');
  return true;
};
