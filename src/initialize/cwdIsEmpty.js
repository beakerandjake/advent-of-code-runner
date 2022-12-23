import { readdir } from 'node:fs/promises';
import { getConfigValue } from '../config.js';

/**
 * Files / directories listed in this whitelist will be ignored when checking cwd is empty.
 */
const whitelist = [
  '.git',
  '.DS_Store',
  'LICENSE',
];

/**
 * Checks to see if the cwd of the user is empty.
 */
export const cwdIsEmpty = async () => {
  const files = await readdir(getConfigValue('cwd'));
  for (const file of files) {
    if (!whitelist.includes(file)) {
      return false;
    }
  }
  return true;
};
