import { set } from 'lodash-es';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import { get } from '../util.js';
import { loadFileContents, saveFile } from './io.js';
import { CachedValue } from './cachedValue.js';
import { DataFileIOError, DataFileParsingError } from '../errors/index.js';

const dataFilePath = getConfigValue('paths.dataStoreFile');

// The prevent unnecessary io the contents of the data file are cached.
// This introduces a higher memory footprint at the cost of faster execution time.
// Also introduces difficulties associated with caching and invalidating it.
// But this is a single threaded application which is manually invoked via command line
// So we don't expect anyone else to change the data file while the program is running
// If the user does that then thats their fault and they can deal with cache being stale.
const cachedData = new CachedValue();

/**
 * Hit the file system and return the contents of the data file.
 */
const loadDataFromFile = async () => {
  try {
    logger.silly('loading data store from file: %s', dataFilePath);
    const contents = await loadFileContents(dataFilePath);
    return contents ? JSON.parse(contents) : {};
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new DataFileParsingError(dataFilePath, { cause: error });
    }
    throw new DataFileIOError(dataFilePath, { cause: error });
  }
};

/**
 * Returns the entire data store.
 * If this is the first query then the data store file is loaded from disk.
 * After first load the in-memory cached version is returned.
 */
const getData = async () => {
  if (!cachedData.hasValue()) {
    logger.silly('setting data store cache for first time');
    cachedData.setValue(await loadDataFromFile());
  }

  return cachedData.value;
};

/**
 * Overwrite the entire data store with the new data.
 * This will write the data contents to disk.
 * It will also update the in-memory cache with the new data.
 */
const setData = async (data) => {
  logger.silly('update data store cache and writing to file!');
  // ensure the in-memory cache has the latest values.
  cachedData.setValue(data);
  // write the data to disk
  return saveFile(dataFilePath, JSON.stringify(data));
};

/**
 * Attempts to load a value from the data store.
 * If the resolved value is undefined, the default value is returned in its place.
 * @param {String} key
 * @param {any} defaultValue
 */
export const getStoreValue = async (key, defaultValue = undefined) => {
  logger.silly('loading store value with key: "%s"', key);
  const data = await getData();
  const toReturn = get(data, key, defaultValue);
  logger.silly('loaded value from store: %s', toReturn);
  return toReturn;
};

/**
 * Updates the data store file, setting the key to the value.
 * @param {String} key
 * @param {Any} value
 */
export const setStoreValue = async (key, value) => {
  logger.silly('setting store value with key: "%s" to: %s', key, value);
  const data = await getData();
  set(data, key, value);
  await setData(data);
};
