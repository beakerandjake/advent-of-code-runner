import { humanizeMinutesDifference } from '../formatting.js';
import { UserError } from './userError.js';

/**
 * Error that is raised when the user is submitting solutions too frequently
 */
export class RateLimitExceededError extends UserError {
  constructor(message, expiration) {
    const updatedMessage = `${message} Please wait ${humanizeMinutesDifference(expiration, new Date())} before trying again.`;
    super(updatedMessage);
    this.name = 'RateLimitExceededError';
  }
}
