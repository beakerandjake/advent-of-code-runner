import { getConfigValue } from '../../config.js';
import { logger } from '../../logger.js';
import { yearIsValid } from '../../validation/index.js';

/**
 * Grabs the year value from the config, validates it, then adds it to the args.
 * @throws {RangeError} The year was not valid
 */
export const getYear = (args = {}) => {
  logger.debug('getting year');
  const year = getConfigValue('aoc.year');

  if (!yearIsValid(year)) {
    throw new RangeError(`The year: ${year} is invalid, check your .env file to ensure you have specified a valid year.`);
  }

  logger.debug('got year value of: %s', year);
  return { ...args, year };
};
