import { logger } from '../../logger.js';
import { dataStoreFileExists } from '../../persistence/jsonFileStore.js';

/**
 * Asserts that the user has ran an init command in the cwd.
 */
export const assertInitialized = async () => {
  /**
   * it's probably enough to check if the data store file exists
   * not worth it to check packages installed or src files exist etc.
   * we can be pretty sure they have ran init if the data store file is there.
   */
  const initialized = await dataStoreFileExists();
  logger.debug('cwd is initialized: %s', initialized);
  return initialized;
};