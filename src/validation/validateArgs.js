import { getConfigValue } from '../config.js';

/**
 * Does the year match one where advent of code was held?
 * @param {Number} year
 */
export const yearIsValid = (year) =>
  getConfigValue('aoc.validation.years').includes(year);

/**
 * Is the day one where an advent of code puzzle happens?
 * @param {Number} day
 */
export const dayIsValid = (day) =>
  getConfigValue('aoc.validation.days').includes(day);

/**
 * Is the level of the puzzle a valid value?
 * @param {Number} level
 */
export const levelIsValid = (level) =>
  getConfigValue('aoc.validation.levels').includes(level);
