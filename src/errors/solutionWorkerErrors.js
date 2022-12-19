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
 * Error raised if a users solution function raises an error.
 */
export class UserSolutionThrewError extends Error {
  constructor(functionName, originalError) {
    super(`Your function: "${functionName}" threw the following Error:`, { cause: originalError });
    // modify the stack trace to output the original error
    // this is more relevant to the user than what part of our code raised this error.
    this.stack = [
      this.message,
      `↳ ${originalError?.stack ? originalError.stack : originalError}`,
    ].join('\n');
    this.name = 'UserSolutionThrewError';
  }
}

/**
 * Error raised if a users solution file is missing the required function.
 */
export class UserSolutionMissingFunctionError extends UserError {
  constructor(functionName) {
    super(`Function not found. Your solution file must export function "${functionName}" as a named export.`);
    this.name = 'UserSolutionMissingFunctionError';
  }
}
