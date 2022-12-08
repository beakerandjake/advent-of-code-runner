import { getConfigValue } from './config.js';

/**
 * Returns true if the value is an integer.
 * @param {Any} value
 */
const isPositiveInteger = (value) => Number.isFinite(value) && Number.isInteger(value) && value > 0;

/**
 * Is the year one where aoc happened?
 * @param {Number} year
 */
export const yearIsValid = (year) => {
  if (!isPositiveInteger(year)) {
    return false;
  }

  return getConfigValue('aoc.puzzleValidation.years').includes(year);
};

/**
 * Is the day one where there is a puzzle?
 * @param {Number} day
 */
export const dayIsValid = (day) => {
  if (!isPositiveInteger(day)) {
    return false;
  }

  return getConfigValue('aoc.puzzleValidation.days').includes(day);
};

/**
 * Is the part a valid puzzle part?
 * @param {Number} part
 */
export const partIsValid = (part) => {
  if (!isPositiveInteger(part)) {
    return false;
  }

  return getConfigValue('aoc.puzzleValidation.parts').includes(part);
};
