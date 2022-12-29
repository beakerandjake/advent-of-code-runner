import { addMilliseconds, isFuture, isValid } from 'date-fns';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import { getRateLimit, setRateLimit } from '../persistence/rateLimitRepository.js';

/**
 * The type of aoc api requests that support rate limiting.
 */
export const rateLimitedActions = {
  downloadInput: 'downloadInput',
  submitAnswer: 'submitAnswer',
};

/**
 * Is the action type a known value?
 * @param {String} actionType
 */
const actionIsValid = (actionType) => Object.values(rateLimitedActions).includes(actionType);

/**
 * Is the action rate limited?
 * @param {String} actionType
 */
export const isRateLimited = async (actionType) => {
  if (!actionIsValid(actionType)) {
    throw new Error(`Unknown rate limit action type: ${actionType}`);
  }

  const expiration = await getRateLimit(actionType);
  const limited = !!(expiration && isValid(expiration) && isFuture(expiration));

  logger.debug('action: %s is rate limited: %s, expires: %s', actionType, limited, expiration);

  return { limited, expiration: isValid(expiration) ? expiration : null };
};

/**
 * Updates the rate limit expiration for the action.
 * @param {String} actionType
 */
export const updateRateLimit = async (actionType) => {
  if (!actionIsValid(actionType)) {
    throw new Error(`Unknown rate limit action type: ${actionType}`);
  }

  const expiration = addMilliseconds(new Date(), getConfigValue('aoc.rateLimiting.defaultTimeoutMs'));
  logger.debug('updated rate limit for action: %s, now expires at: %s', actionType, expiration);
  await setRateLimit(actionType, expiration);
};
