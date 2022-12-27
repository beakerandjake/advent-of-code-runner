import { getConfigValue } from '../config.js';
import { clearDirectory } from '../persistence/io.js';
import { logger } from '../logger.js';

/**
 * Clears the /inputs folder to remove any potentially stale input files.
 */
export const deleteExistingInputFiles = async () => {
  logger.debug('removing old input files.');
  const inputsDirectory = getConfigValue('paths.inputsDir');
  await clearDirectory(inputsDirectory);
};
