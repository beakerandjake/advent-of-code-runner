import {
  writeFile,
  mkdir,
  access,
  readFile,
  copyFile as copy,
  open,
} from 'fs/promises';
import { dirname } from 'path';
import { logger } from './logger.js';

/**
 * Recursively creates all directories which do not exist. Existing directories will be skipped.
 * @param {String} path
 */
export const ensureDirectoriesExist = async (path) => {
  logger.silly('ensuring directories exists: %s', path);
  await mkdir(path, { recursive: true });
};

/**
 * Write the contents to the file specified by fileName
 * @param {String} fileName
 * @param {String} data
 * @param {String} flags
 */
const writeToFile = async (fileName, data, flags = 'w') => {
  logger.silly('writing file: %s with flags: %s', fileName, flags);
  await ensureDirectoriesExist(dirname(fileName));
  await writeFile(fileName, data, { flag: flags });
  logger.silly('successfully wrote file: %s', fileName);
};

/**
 * Writes the data to the file, overwriting the existing file if already exists, creating if not.
 * @param {String} fileName
 * @param {String|Stream} data
 */
export const saveFile = async (fileName, data) => {
  await writeToFile(fileName, data);
};

/**
 * Writes the data to the file, appending to the end of the existing file or creating file if not.
 * @param {String} fileName
 * @param {String|Stream} data
 */
export const appendToFile = async (fileName, data) => {
  await writeToFile(fileName, data, 'a+');
};

/**
 * Copies a file from source to destination
 * @param {String} sourcePath
 * @param {String} destPath
 */
export const copyFile = async (sourcePath, destPath) => {
  logger.silly('copying file: %s to: %s', sourcePath, destPath);
  await copy(sourcePath, destPath);
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

export const openFile = async (fileName) => {
  logger.silly('opening file at: %s', fileName);
  return open(fileName);
};
