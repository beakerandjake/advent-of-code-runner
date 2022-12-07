import {
  writeFile, mkdir, access, readFile,
} from 'fs/promises';
import { dirname } from 'path';
import { logger } from './logger.js';

/**
 * Recursively creates all directories which do not exist. Existing directories will be skipped.
 * @param {String} fileName
 */
export const ensureDirectoriesExist = async (fileName) => {
  const directory = dirname(fileName);
  logger.silly('ensuring directories exists: %s', directory);
  await mkdir(directory, { recursive: true });
};

/**
 * Writes the data to the file, overwriting the existing file if already exists, creating if not.
 * @param {String} fileName
 * @param {String|Stream} data
 */
export const saveFile = async (fileName, data) => {
  logger.silly('writing file: %s', fileName);
  await ensureDirectoriesExist(fileName);
  await writeFile(fileName, data);
  logger.silly('successfully wrote file: %s', fileName);
};

/**
 * Checks to see if the file exists at the given path.
 * @param {String} fileName
 */
export const fileExists = async (fileName) => {
  logger.silly('checking if file exists: %s', fileName);

  try {
    await access(fileName);
    logger.silly('file exists');
    return true;
  } catch (error) {
    logger.silly('file does not exist');
    return false;
  }
};

/**
 * Attempts to load the file at the given path and returns the string content.
 * @param {String} fileName
 */
export const loadFileContents = async (fileName) => {
  logger.silly('loading file contents: %s', fileName);
  return (await readFile(fileName)).toString();
};
