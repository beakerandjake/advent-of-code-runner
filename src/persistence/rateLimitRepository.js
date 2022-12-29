import { isDate, isValid, parseISO } from 'date-fns';
import { getValue, setValue } from './jsonFileStore.js';

/**
 * The key to the data in the json file.
 */
const RATE_LIMITS_STORE_KEY = 'rateLimits';

/**
 * Parses a date from an ISO8601 string.
 * If a valid date could not be parsed, returns null.
 * @param {String} isoString
 */
const isoStringToDate = (value) => {
  const parsed = parseISO(value);

  if (!isValid(parsed)) {
    throw new TypeError(`Failed to parse ISO8601 date string from value: "${value}"`);
  }

  return parsed;
};

/**
 * Returns the stored expiration date of the actions rate limit.
 * @param {String} actionType - The key of the action to update
 */
export const getRateLimit = async (actionType) => {
  const rateLimits = await getValue(RATE_LIMITS_STORE_KEY, {});
  return rateLimits[actionType]
    ? isoStringToDate(rateLimits[actionType])
    : null;
};

/**
 * Updates the expiration date of the actions rate limit.
 * @param {String} actionType - The key of the action to update
 * @param {Date} expiration - The time when the rate limit expires
 */
export const setRateLimit = async (actionType, expiration) => {
  if (!isDate(expiration) || !isValid(expiration)) {
    throw new TypeError(`Attempted to set rate limit expiration to invalid date: "${expiration}"`);
  }

  const rateLimits = await getValue(RATE_LIMITS_STORE_KEY, {});
  const updated = { ...rateLimits, [actionType]: expiration.toISOString() };
  await setValue(RATE_LIMITS_STORE_KEY, updated);
};
