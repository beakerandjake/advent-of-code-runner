import {
  writeFile, mkdir, access, readFile,
} from 'fs/promises';
import { dirname } from 'path';
import { logger } from './logger.js';
import { sizeOfStringInKb } from './utils.js';

/**
 * Recursively creates all directories which do not exist. Existing directories will be skipped.
 * @param {String} fileName
 */
export const ensureDirectoriesExist = async (fileName) => {
  const directory = dirname(fileName);
  logger.debug('ensuring directories exists: %s', directory);
  await mkdir(directory, { recursive: true });
};

/**
 * Writes the data to the file, overwriting the existing file if already exists, creating if not.
 * @param {String} fileName
 * @param {String|Stream} data
 */
export const saveFile = async (fileName, data) => {
  logger.debug('writing file: %s', fileName);
  await ensureDirectoriesExist(fileName);
  await writeFile(fileName, data);
  logger.debug('successfully wrote file: %s', fileName);
};

/**
 * Checks to see if the file exists at the given path.
 * @param {String} fileName
 */
export const fileExists = async (fileName) => {
  logger.debug('checking if file exists: %s', fileName);

  try {
    await access(fileName);
    logger.debug('file exists');
    return true;
  } catch (error) {
    logger.debug('file does not exist');
    return false;
  }
};

/**
 * Attempts to load the file at the given path and returns the string content.
 * @param {String} fileName
 */
export const loadFileToString = async (fileName) => {
  logger.debug('loading file: %s', fileName);
  const text = (await readFile(fileName)).toString();
  logger.debug('loaded file at: %s, size: %skb', fileName, sizeOfStringInKb(text));
  return text;
};
