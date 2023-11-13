import { getConfigValue } from '../config.js';

/**
 * Does the year match one where advent of code was held?
 * @param {Number} year
 */
export const yearIsValid = (year) =>
  getConfigValue('aoc.validation.years').includes(year);
