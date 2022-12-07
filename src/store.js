import { get, set } from 'lodash-es';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { getConfigValue } from './config.js';
import { logger } from './logger.js';
import { ensureDirectoriesExist } from './io.js';

const DATA_FILE_PATH = join(
  getConfigValue('dataStore.folderPath'),
  getConfigValue('dataStore.fileName'),
);

/**
 * Loads and returns the contents of the data store file (if any)
 */
const getDataFileContents = async () => {
  logger.debug('loading data file at: %s', DATA_FILE_PATH);

  try {
    const data = await readFile(DATA_FILE_PATH);
    return JSON.parse(data);
  } catch (error) {
    logger.info('failed to load data store file at: %s', DATA_FILE_PATH);
    return {};
  }
};

/**
 * Attempts to load a value from the data store.
 * If the resolved value is undefined, the default value is returned in its place.
 * @param {String} key
 * @param {any} defaultValue
 */
export const getStoreValue = async (key, defaultValue = undefined) => {
  logger.debug('loading store value with key: "%s"', key);
  const data = await getDataFileContents();
  const toReturn = get(data, key, defaultValue);
  logger.debug('loaded value from store: %s', toReturn);
  return toReturn;
};

/**
 * Updates or creates the data store file with the data.
 */
const saveDataFileContents = async (data) => {
  logger.debug('updating data store file file with new data');
  await ensureDirectoriesExist(DATA_FILE_PATH);
  writeFile(DATA_FILE_PATH, JSON.stringify(data));
};

/**
 * Updates the data store file, setting the key to the value.
 * @param {String} key
 * @param {Any} value
 */
export const setStoreValue = async (key, value) => {
  logger.debug('setting store value with key: "%s" to: %s', key, value);
  const data = await getDataFileContents();
  set(data, key, value);
  saveDataFileContents(data);
};
