import { toNumber } from 'lodash-es';
import { getYear } from 'date-fns';
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

export const yearIsValid = (year) => {
  const parsed = parseNumber(year);

  if (Number.isNaN(parsed)) {
    return false;
  }

  const startYear = getConfigValue('aoc.validation.minYear');
  const endYear = getYear(new Date());

  if (startYear > endYear) {
    throw new RangeError(`End year: ${endYear} is less than start year: ${startYear}. How did you time travel?`);
  }

  return parsed >= startYear && parsed <= endYear;
};

export const dayIsValid = (day) => {

};

export const partIsValid = (part) => {

};
