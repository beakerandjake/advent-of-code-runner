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

/**
 * Error that is raised if authentication failed.
 */
export class NotAuthorizedError extends UserError {
  constructor(...args) {
    super(
      "Authentication failed, your token may have expired. You can run the 'auth' command to update your token.",
      ...args
    );
    this.name = 'NotAuthorizedError';
  }
}

/**
 * Error raised if puzzle not found.
 */
export class PuzzleNotFoundError extends UserError {
  constructor(year, day, ...args) {
    super(`Server could not find puzzle (year:${year}, day:${day})`, ...args);
    this.name = 'PuzzleNotFoundError';
  }
}

/**
 * Error raised if server responds with a 500 or general error.
 */
export class InternalServerError extends UserError {
  constructor(status, statusText, ...args) {
    super(
      `Server responded with unexpected error: ${status} - ${statusText}`,
      ...args
    );
    this.name = 'InternalServerError';
  }
}

/**
 * Error raised if server returns an empty input.
 */
export class EmptyResponseError extends UserError {
  constructor(...args) {
    super(`Server returned empty input.`, ...args);
    this.name = 'EmptyResponseError';
  }
}

/**
 * Raised if failed to parse a submit answer response
 */
export class ParsePostAnswerResponseError extends UserError {
  constructor(response, ...args) {
    super(
      `Failed to parse the response from the server when submitting answer.\n\nRaw response html:\n\n${response}\n\nYou can help by submitting a bug report (https://github.com/beakerandjake/advent-of-code-runner/issues).`,
      ...args
    );
    this.name = 'ParsePostAnswerResponseError';
  }
}
