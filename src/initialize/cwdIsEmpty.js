import { readdir } from 'node:fs/promises';
import { getConfigValue } from '../config.js';

/**
 * Checks to see if the cwd of the user is empty.
 */
export const cwdIsEmpty = async () => {
  const whitelist = getConfigValue('initialize.emptyCwdWhitelist');
  const files = await readdir(getConfigValue('cwd'));
  for (const file of files) {
    if (!whitelist.includes(file)) {
      return false;
    }
  }
  return true;
};
