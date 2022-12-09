import { parseISO, differenceInMilliseconds, isValid } from 'date-fns';
import { getConfigValue } from './config.js';
import { logger } from './logger.js';
import { getStoreValue, setStoreValue } from './store.js';

/**
 * The key used in the data store where the last request time value is saved.
 */
const LAST_REQUEST_STORE_KEY = 'lastRequestTime';

/**
 * Store the Date of the last request made to the aoc servers.
 * @param {Date} date
 */
export const setLastRequestTime = async () => {
  const now = new Date().toISOString();
  logger.debug('updating request throttle, setting last request time to: %s', now);
  await setStoreValue(LAST_REQUEST_STORE_KEY, now);
};

/**
 * Has enough time passed since the last request that a new request to the aoc server can be sent?
 */
export const isRateLimited = async () => {
  logger.debug('checking if enough time has passed since last request to send new request');

  const lastRequestTime = await getStoreValue(LAST_REQUEST_STORE_KEY);

  if (!lastRequestTime) {
    logger.debug('could not find time of last request, new request is allowed.');
    return true;
  }

  const parsedDate = parseISO(lastRequestTime);

  if (!isValid(parsedDate)) {
    logger.warn('failed to parse date from last request time: %s', lastRequestTime);
    return true;
  }

  const msSinceLastRequest = differenceInMilliseconds(new Date(), parsedDate);
  const toReturn = msSinceLastRequest > getConfigValue('aoc.rateLimiting.defaultTimeoutMs');

  logger.debug('number of ms since last request: %s, can send new request: %s', msSinceLastRequest, toReturn);

  return toReturn;
};
