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
    throw new RangeError(`Could not get a valid year from your data file, this should have been set during initialization. Year was: "${year}"`);
  }

  logger.debug('got year value of: %s', year);
  return { year };
};
