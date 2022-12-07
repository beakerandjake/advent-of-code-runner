import get from 'lodash.get';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getConfigValue } from './config.js';
import { logger } from './logger.js';

const DATA_FILE_PATH = join(
  getConfigValue('dataStore.folderPath'),
  getConfigValue('dataStore.fileName'),
);

/**
 * Loads and returns the contents of the data store file (if any)
 */
const getDataFileContents = async () => {
  logger.debug('loading data file at: %s', DATA_FILE_PATH);
  const data = await readFile(DATA_FILE_PATH);
  return JSON.parse(data);
};

/**
 * Attempts to load a value from the data store.
 * If the resolved value is undefined, the default value is returned in its place.
 * @param {String} key
 * @param {any} defaultValue
 */
export const getStoreValue = async (key, defaultValue = undefined) => {
  logger.debug('loading data with key: "%s"', key);

  try {
    const data = await getDataFileContents();
    const toReturn = get(data, key, defaultValue);
    logger.debug('loaded value from store: %s', toReturn);
    return toReturn;
  } catch (error) {
    logger.debug(
      'failed to load data store file, returning default value: %s',
      defaultValue,
    );
    return defaultValue;
  }
};
