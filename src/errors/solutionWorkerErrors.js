import { UserError } from './userError.js';

/**
 * Error raised if the Solution Worker thread raises the "error" event.
 */
export class SolutionWorkerUnexpectedError extends UserError {
  constructor(message, ...args) {
    super(`Unexpected error raised by Solution Worker Thread: ${message}`, ...args);
    this.name = 'SolutionWorkerUnexpectedError';
  }
}

/**
 * Error raised if the Solution Worker thread exits without posting an answer message.
 */
export class SolutionWorkerExitWithoutAnswerError extends UserError {
  constructor(message, ...args) {
    super('Solution Worker Thread exited without returning an answer', ...args);
    this.name = 'SolutionWorkerExitWithoutGivingAnswer';
  }
}

/**
 * Error raised if Solution Worker is provided empty input.
 */
export class SolutionWorkerEmptyInputError extends Error {
  constructor() {
    super('Provided puzzle input was empty');
    this.name = 'SolutionWorkerEmptyInputError';
  }
}

/**
 * Error raised if users solution returns an answer of the wrong type.
 */
export class UserSolutionAnswerInvalidError extends Error {
  constructor(answerType) {
    super(`Unsupported answer type, answer must be a string or number. You provided: "${answerType}".`);
    this.name = 'UserSolutionAnswerInvalidError';
  }
}

/**
 * Error raised if users solution file cannot be found.
 */
export class UserSolutionFileNotFoundError extends UserError {
  constructor(fileName) {
    super(`Could not find your solution file, ensure file exits: ${fileName}`);
    this.name = 'UserSolutionFileNotFoundError';
  }
}

/**
 * Error that is raised when a users solution function raises an error.
 */
export class UserSolutionThrewError extends UserError {
  constructor(stack) {
    super('Your code threw an error!');
    this.stack = stack;
    this.name = 'UserSolutionThrewError';
  }
}
