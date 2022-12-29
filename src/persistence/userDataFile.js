import { readJson, writeJson, pathExists } from 'fs-extra/esm';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import { get } from '../util.js';
import { CachedValue } from './cachedValue.js';

const dataFilePath = getConfigValue('paths.userDataFile');

/**
 * Use caching to store the data file in memory.
 * This gives a faster execution time at the const of a higher memory footprint.
 * Also introduces difficulties associated with caching and invalidating it.
 * But this is a single threaded application which is manually invoked via command line
 * So we don't expect anyone else to change the data file while the program is running
 * If the user does that then thats their fault and they can deal with cache being stale.
 */
const cachedData = new CachedValue();

/**
 * Returns the contents of the user data store.
 */
const loadData = async () => {
  if (!cachedData.hasValue()) {
    // populate cache with file contents on first load.
    logger.silly('loading data store from file: %s', dataFilePath);
    const fileContents = await readJson(dataFilePath);
    cachedData.setValue(fileContents);
  }
  return cachedData.value;
};

/**
 * Write the data to the user data file. Also updates the in-memory cache.
 */
const saveData = async (data) => {
  logger.silly('update data store cache and writing to file!');
  cachedData.setValue(data);
  await writeJson(dataFilePath, data);
};

/**
 * Attempts to load a value from the data store.
 * If the resolved value is undefined, the default value is returned in its place.
 * @param {String} key
 * @param {any} defaultValue
 */
export const getValue = async (key, defaultValue = undefined) => {
  logger.silly('loading store value with key: "%s"', key);
  const data = await loadData();
  return get(data, key, defaultValue);
};

/**
 * Updates the data store file, setting the key to the value.
 * @param {String} key
 * @param {Any} value
 */
export const setValue = async (key, value) => {
  logger.silly('setting store value with key: "%s" to: %s', key, value);
  const data = await loadData();
  const updated = { ...data, [key]: value };
  await saveData(updated);
};

/**
 * Returns true if the user data file exists.
 */
export const userDataFileExists = async () => pathExists(dataFilePath);
