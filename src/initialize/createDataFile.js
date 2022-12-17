import { getConfigValue } from '../config.js';
import { copyFile } from '../persistence/io.js';
import { logger } from '../logger.js';

/**
 * Creates a aocr-data.json file in the cwd.
 */
export const createDataFile = async () => {
  logger.debug('creating data file');
  const { source, dest } = getConfigValue('paths.templates.dataStoreFile');
  logger.debug('copying template data store file from: %s to: %s', source, dest);
  return copyFile(source, dest);
};
