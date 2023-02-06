import { UserError } from './userError.js';

/**
 * Error that is raised if the user makes too many requests to advent of code.
 */
export class RateLimitExceededError extends UserError {
  constructor(message, duration, ...args) {
    super(`${message} Please wait ${duration} before trying again.`, ...args);
    this.name = 'RateLimitExceededError';
  }
}

/**
 * Error that is raised if the user tries to solve a puzzle they have already solved.
 */
export class SolvingWrongLevelError extends UserError {
  constructor(...args) {
    super(
      'You are attempting to solve the wrong level of this puzzle. Have you completed the requisite level?',
      ...args
    );
    this.name = 'SolvingWrongLevelError';
  }
}
