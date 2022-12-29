import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import { get } from '../util.js';
import { CachedValue } from './cachedValue.js';
import { fileExists, loadFileContents, saveFile } from './io.js';

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
 * Loads the user data from disk
 */
const loadDataFromFile = async () => {
  logger.silly('loading data store from file: %s', dataFilePath);
  const contents = await loadFileContents(dataFilePath);
  return contents ? JSON.parse(contents) : {};
};

/**
 * Returns the contents of the user data store.
 * The first call loads the data from disk, subsequent calls return the cached data.
 */
const loadData = async () => {
  if (!cachedData.hasValue()) {
    logger.silly('setting data store cache for first time');
    cachedData.setValue(await loadDataFromFile());
  }
  return cachedData.value;
};

/**
 * Write the data to the user data file. Also updates the in-memory cache.
 */
const saveData = async (data) => {
  logger.silly('update data store cache and writing to file!');
  cachedData.setValue(data);
  await saveFile(dataFilePath, JSON.stringify(data));
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
export const userDataFileExists = async () => fileExists(dataFilePath);
