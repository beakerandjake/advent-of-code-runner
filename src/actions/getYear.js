import { getConfigValue } from '../config.js';
import { yearIsValid } from '../validation/index.js';

/**
 * Grabs the year value from the config, validates and returns it.
 * @throws {RangeError}
 * @returns {Number}
 */
export const getYear = () => {
  const year = getConfigValue('aoc.year');

  if (!yearIsValid(year)) {
    throw new RangeError(`The year: ${year} is invalid, check your .env file to ensure you have specified a valid year.`);
  }

  return year;
};
