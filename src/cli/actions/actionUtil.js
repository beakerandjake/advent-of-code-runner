import { getConfigValue } from '../../config.js';
import { InvalidYearError } from '../../errors/index.js';
import { yearIsValid } from '../../validation/validateArgs.js';

/**
 * Grabs the year value from the config, validates and returns it.
 * @throws {YearIsInvalidError}
 * @returns {Number}
 */
export const getYear = () => {
  const year = getConfigValue('aoc.year');

  if (!yearIsValid(year)) {
    throw new InvalidYearError();
  }

  return year;
};
