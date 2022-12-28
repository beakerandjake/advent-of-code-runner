import { logger } from '../../logger.js';
import { yearIsValid } from '../../validation/index.js';
import { getStoreValue } from '../../persistence/jsonFileStore.js';

const YEAR_STORE_KEY = 'year';

/**
 * Grabs the year value from the config, validates it, then adds it to the args.
 * @throws {RangeError} The year was not valid
 */
export const getYear = async () => {
  const year = await getStoreValue(YEAR_STORE_KEY);

  if (!yearIsValid(year)) {
    throw new RangeError(`The year: ${year} is invalid, this should have been set to a valid value during initialization.`);
  }

  logger.debug('got year value of: %s', year);
  return { year };
};
