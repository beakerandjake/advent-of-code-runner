import { RateLimitExceededError } from '../errors/rateLimitExceededError.js';
import { isRateLimited, updateRateLimit } from './rateLimit.js';

/**
 * Decorates a function with rate limiting.
 * The decorated function will not be called if the rate limit is active.
 * After the function is called, the rate limit for this action will be updated.
 * @param {String} actionType
 * @param {Function} fn
 */
export const rateLimitDecorator = (
  fn,
  actionType,
  exceededMessage = 'Rate limit exceeded.',
) => async (...args) => {
  const { limited, expiration } = await isRateLimited(actionType);

  if (limited) {
    throw new RateLimitExceededError(exceededMessage, expiration);
  }

  try {
    return fn(...args);
  } finally {
    await updateRateLimit(actionType);
  }
};
