import { emptyDir } from 'fs-extra/esm';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';

/**
 * Clears the /inputs folder to remove any potentially stale input files.
 */
export const deleteExistingInputFiles = async () => {
  logger.debug('removing old input files.');
  const inputsDirectory = getConfigValue('paths.inputsDir');
  await emptyDir(inputsDirectory);
};
