import {
  writeFile, mkdir, access, readFile, copyFile as copy,
} from 'fs/promises';
import { dirname, parse } from 'path';
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
 * Writes the data to the file, overwriting the existing file if already exists, creating if not.
 * @param {String} fileName
 * @param {String|Stream} data
 */
export const saveFile = async (fileName, data) => {
  logger.silly('writing file: %s', fileName);
  await ensureDirectoriesExist(dirname(fileName));
  await writeFile(fileName, data);
  logger.silly('successfully wrote file: %s', fileName);
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
