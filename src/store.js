import { get, set } from 'lodash-es';
import { join } from 'path';
import { getConfigValue } from './config.js';
import { logger } from './logger.js';
import { loadFileContents, saveFile } from './io.js';

// TODO: can cache and watch for file changes to invalidate
// cache, helps with multiple gets being called, and can potentially remove
// a read on a write.

export const dataFilePath = join(
  getConfigValue('dataStore.folderPath'),
  getConfigValue('dataStore.fileName'),
);

/**
 * Loads and returns the contents of the data store file (if any)
 */
const getDataFileContents = async () => {
  try {
    const contents = await loadFileContents(dataFilePath);
    return JSON.parse(contents);
  } catch (error) {
    logger.silly('failed to load data store file at: %s', dataFilePath);
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
  logger.silly('loading store value with key: "%s"', key);
  const data = await getDataFileContents();
  const toReturn = get(data, key, defaultValue);
  logger.silly('loaded value from store: %s', toReturn);
  return toReturn;
};

/**
 * Updates or creates the data store file with the data.
 */
const saveDataFileContents = async (data) => {
  logger.silly('updating data store file file with new data');
  return saveFile(dataFilePath, JSON.stringify(data));
};

/**
 * Updates the data store file, setting the key to the value.
 * @param {String} key
 * @param {Any} value
 */
export const setStoreValue = async (key, value) => {
  logger.silly('setting store value with key: "%s" to: %s', key, value);
  const data = await getDataFileContents();
  set(data, key, value);
  await saveDataFileContents(data);
  logger.silly('set store value with key: "%s"', key);
};

/**
 * Clears the data store file and all saved values.
 */
export const clearStore = async () => {
  logger.silly('clearing data store file');
  await saveDataFileContents({});
};
