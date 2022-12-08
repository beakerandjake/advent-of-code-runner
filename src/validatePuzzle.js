import { toNumber } from 'lodash-es';
import { getMonth, getYear } from 'date-fns';
import { getConfigValue } from './config.js';

/**
 * Attempts to parse a number from the specified value.
 * @param {Any} value
 */
const parseNumber = (value) => {
  if (!value && value !== 0) {
    return NaN;
  }

  return toNumber(value);
};

/**
 * Is the year one where aoc happened?
 * @param {Number} year
 */
export const yearIsValid = (year) => {
  const parsed = parseNumber(year);

  if (Number.isNaN(parsed)) {
    return false;
  }

  const startYear = getConfigValue('aoc.puzzleValidation.minYear');
  const endYear = getYear(new Date());

  // sanity in case someone changed their clocks.
  if (startYear > endYear) {
    throw new RangeError(`End year: ${endYear} is less than start year: ${startYear}. How did you time travel?`);
  }

  // if it's not christmas time in the current year then the current year isn't valid.
  if (getMonth(new Date()) !== getConfigValue('aoc.puzzleValidation.month')) {
    return false;
  }

  return parsed >= startYear && parsed <= endYear;
};

/**
 * Is the day one where there is a puzzle?
 * @param {Number} day
 */
export const dayIsValid = (day) => {
  const parsed = parseNumber(day);

  if (Number.isNaN(parsed)) {
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
  const parsed = parseNumber(part);

  if (Number.isNaN(parsed)) {
    return false;
  }

  return getConfigValue('aoc.puzzleValidation.parts').includes(parsed);
};
