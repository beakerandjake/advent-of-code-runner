import { getConfigValue } from '../config.js';

/**
 * Converts and returns the config value to a boolean.
 * @param {String} key
 */
export const assertConfigValue = (key) => {
  if (key == null || key === '') {
    throw new Error('null or undefined key');
  }

  // create a variable for this fn instead of just returning the fn
  // this gives the fn a .name property and makes debugging easier.
  const _ = {
    assertConfigValue: () => !!getConfigValue(key),
  };

  return _.assertConfigValue;
};
