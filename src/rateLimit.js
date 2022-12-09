import {
  parseISO, isValid, addMilliseconds, isFuture,
} from 'date-fns';
import { get, includes, set } from 'lodash-es';
import { getConfigValue } from './config.js';
import { logger } from './logger.js';
import { getStoreValue, setStoreValue } from './store.js';

const RATE_LIMITS_STORE_KEY = 'rateLimits';

/**
 * The type of aoc api requests that support rate limiting.
 */
export const rateLimitedActions = {
  downloadInput: 'INPUT',
  submitAnswer: 'SUBMIT',
};

/**
 * Returns the stored expiration date of the actions rate limit (if any)
 * @param {String} action - The key of the action to update (keys defined in rateLimitedActions)
 */
const getActionRateLimitExpiration = async (action) => {
  const rateLimits = await getStoreValue(RATE_LIMITS_STORE_KEY, {});
  return get(rateLimits, action);
};

/**
 * Set the date after which the action can be performed.
 * @param {String} action - The action to set the rate limit for.
 * @param {String} expirationDate - The date the rate limit expires (ISO8601 date string)
 */
const setActionRateLimitExpiration = async (action, expirationDate) => {
  const rateLimits = await getStoreValue(RATE_LIMITS_STORE_KEY, {});
  set(rateLimits, action, expirationDate);
  await setStoreValue(RATE_LIMITS_STORE_KEY, rateLimits);
};

/**
 * Stores a timeout which can lock out that api action until the timeout expires.
 * @param {String} action - The key of the action to update (keys defined in rateLimitedActions)
 * @param {Number} timeoutOverrideMs - If no value is provided the default value will be used.
 */
export const updateRateLimit = async (action = '', timeoutOverrideMs = null) => {
  logger.debug('updating rate limit for action: %s, timeoutOverrideMs: %s', action, timeoutOverrideMs);

  if (!includes(rateLimitedActions, action)) {
    throw new Error(`Unknown rate limit action: ${action}`);
  }

  const timeoutDurationMs = Math.max(getConfigValue('aoc.rateLimiting.defaultTimeoutMs'), timeoutOverrideMs);

  logger.debug('using timeout duration value of: %s', timeoutDurationMs);

  const rateLimitExpiration = addMilliseconds(new Date(), timeoutDurationMs).toISOString();

  logger.debug('rate limit for action: %s now expires at: %s', action, rateLimitExpiration);

  await setActionRateLimitExpiration(action, rateLimitExpiration);
};

/**
 * Is the current action rate limited?
 * @param {String} action - The key of the action to update (keys defined in rateLimitedActions)
 */
export const checkActionRateLimit = async (action = '') => {
  logger.debug('checking rate limit for action: %s', action);

  if (!includes(rateLimitedActions, action)) {
    throw new Error(`Unknown rate limit action: ${action}`);
  }

  const parsedDate = parseISO(await getActionRateLimitExpiration(action));
  const limited = isValid(parsedDate) && isFuture(parsedDate);
  const expiration = limited ? parsedDate : null;

  logger.debug('action: %s is rate limited: %s, expiration: %s', action, limited instanceof Date, expiration);

  return { limited, expiration };
};
