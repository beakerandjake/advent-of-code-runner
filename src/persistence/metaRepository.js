import { logger } from '../logger.js';
import { getValue } from './userDataFile.js';
import { getConfigValue } from '../config.js';
import { AuthTokenNotFoundError } from '../errors/cliErrors.js';

/**
 * Returns the year that the project is configured to use.
 * @throws {RangeError} The year was not valid
 * @returns {Promise<number>}
 */
export const getYear = async () => {
  const year = await getValue('year');
  logger.debug('loaded year value of: %s', year);

  // ensure stored year value is actually valid.
  if (!getConfigValue('aoc.validation.years').includes(year)) {
    throw new RangeError(
      `could not get valid year from data file, year should have been set during init. value was: ${year}`
    );
  }
  return year;
};

/**
 * Returns the users authentication token for advent-of-code
 * @returns {string}
 */
export const getAuthToken = () => {
  const authToken = getConfigValue('aoc.authenticationToken');

  if (!authToken) {
    throw new AuthTokenNotFoundError();
  }

  return authToken;
};
