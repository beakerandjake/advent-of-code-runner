import { getMonth } from 'date-fns';
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

  const startYear = getConfigValue('aoc.puzzleValidation.minYear');
  const endYear = getConfigValue('aoc.puzzleValidation.maxYear');

  // sanity in case someone changed their clocks.
  if (startYear > endYear) {
    throw new RangeError(`End year: ${endYear} is less than start year: ${startYear}. How did you time travel?`);
  }

  // if it's not christmas time in the current year then the current year isn't valid.
  if ((year === endYear || year === startYear) && getMonth(new Date()) !== getConfigValue('aoc.puzzleValidation.month')) {
    return false;
  }

  return year >= startYear && year <= endYear;
};

/**
 * Is the day one where there is a puzzle?
 * @param {Number} day
 */
export const dayIsValid = (day) => {
  if (!isPositiveInteger(day)) {
    return false;
  }

  // todo check puzzle unlock time.

  return day >= getConfigValue('aoc.puzzleValidation.minDay') && day <= getConfigValue('aoc.puzzleValidation.maxDay');
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
