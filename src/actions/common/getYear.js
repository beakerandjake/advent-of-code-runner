import { getConfigValue } from '../../config.js';
import { logger } from '../../logger.js';
import { yearIsValid } from '../../validation/index.js';

/**
 * Grabs the year value from the config, validates it, then adds it to the args.
 * @throws {RangeError}
 */
export const getYear = (args = {}) => {
  const year = getConfigValue('aoc.year');

  if (!yearIsValid(year)) {
    throw new RangeError(`The year: ${year} is invalid, check your .env file to ensure you have specified a valid year.`);
  }

  logger.debug('using year value from config: %s', year);
  return { ...args, year };
};
