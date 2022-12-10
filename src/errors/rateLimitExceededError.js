import { humanizeMinutesDifference } from '../formatting.js';

/**
 * Error that is raised when the user is submitting solutions too frequently
 */
export class RateLimitExceededError extends Error {
  constructor(message, expiration) {
    const updatedMessage = `${message} Please wait ${humanizeMinutesDifference(expiration, new Date())} before trying again.`;
    super(updatedMessage);
    this.name = 'RateLimitExceededError';
  }
}
