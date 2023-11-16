import { isDate, isValid, parseISO } from 'date-fns';
import { readJson, outputJson } from 'fs-extra/esm';
import { getConfigValue } from '../config.js';

/**
 * Saving rate limit data to file, not using caching
 * like user data file, don't expect to be writing/reading this file
 * nearly as much as user data file. If performance becomes issue
 * could perform similar caching.
 */

const rateLimitFilePath = getConfigValue('paths.rateLimitFile');

/**
 * Loads the rate limit data from file.
 */
const loadRateLimitData = async () => {
  try {
    return await readJson(rateLimitFilePath);
  } catch (error) {
    // if rate limit file does not exist then return empty object.
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
};

/**
 * Parses a date from an ISO8601 string.
 * If a valid date could not be parsed, returns null.
 * @param {String} isoString
 */
const isoStringToDate = (value) => {
  const parsed = parseISO(value);

  if (!isValid(parsed)) {
    throw new TypeError(
      `Failed to parse ISO8601 date string from value: "${value}"`
    );
  }

  return parsed;
};

/**
 * Returns the stored expiration date of the actions rate limit.
 * @param {String} actionType - The key of the action to update
 */
export const getRateLimit = async (actionType) => {
  const rateLimits = await loadRateLimitData();
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
    throw new TypeError(
      `Attempted to set rate limit expiration to invalid date: "${expiration}"`
    );
  }
  const rateLimits = await loadRateLimitData();
  const updated = { ...rateLimits, [actionType]: expiration.toISOString() };
  await outputJson(rateLimitFilePath, updated);
};
