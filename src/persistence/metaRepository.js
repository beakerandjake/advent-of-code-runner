import { logger } from '../logger.js';
import { getValue } from './userDataFile.js';
import { getConfigValue } from '../config.js';

const YEAR_STORE_KEY = 'year';

/**
 * Returns the year that the project is configured to use.
 * @throws {RangeError} The year was not valid
 * @returns {Promise<number>}
 */
export const getYear = async () => {
  const year = await getValue(YEAR_STORE_KEY);
  logger.verbose('loaded year value of: %s', year);

  // ensure stored year value is actually valid.
  if (!getConfigValue('aoc.validation.years').includes(year)) {
    throw new RangeError(
      `could not get valid year from data file, year should have been set during init. value was: "${year}"`
    );
  }
  return year;
};
