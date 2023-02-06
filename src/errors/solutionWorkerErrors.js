import { pathToFileURL } from 'url';

/**
 * Error raised if the Solution Worker thread exits without posting an answer message.
 */
export class SolutionWorkerExitWithoutAnswerError extends Error {
  constructor(...args) {
    super('Solution Worker Thread exited without returning an answer', ...args);
    this.name = 'SolutionWorkerExitWithoutAnswerError';
  }
}

/**
 * Error raised if Solution Worker is provided empty input.
 */
export class SolutionWorkerEmptyInputError extends Error {
  constructor(...args) {
    super('Provided puzzle input was empty', ...args);
    this.name = 'SolutionWorkerEmptyInputError';
  }
}

/**
 * Error raised if the Solution Worker gets invoked without required worker data
 */
export class SolutionWorkerMissingDataError extends Error {
  constructor(...args) {
    super('Provided worker data is missing required fields', ...args);
    this.name = 'SolutionWorkerMissingDataError';
  }
}

/**
 * Error raised if users solution returns an answer of the wrong type.
 */
export class UserSolutionAnswerInvalidError extends Error {
  constructor(answerType, fileName, functionName, ...args) {
    super(
      [
        `Your code returned an invalid answer of type: "${answerType}". Answer must be a string or a number.`,
        `at ${functionName} (${pathToFileURL(fileName)})`,
      ].join('\n    '),
      ...args
    );
    this.name = 'UserSolutionAnswerInvalidError';
  }
}

/**
 * Error raised if users solution file cannot be found.
 */
export class UserSolutionFileNotFoundError extends Error {
  constructor(fileName, ...args) {
    super(
      `Could not load your solution file, ensure file exits (${pathToFileURL(
        fileName
      )})`,
      ...args
    );
    this.name = 'UserSolutionFileNotFoundError';
  }
}

/**
 * Creates a new stack trace which merges the message
 * and the original errors stack trace.
 * @param {String} message
 * @param {Error} originalError
 */
const withOriginalErrorStack = (message, originalError) =>
  [
    message,
    `↳ ${originalError?.stack ? originalError.stack : originalError}`,
  ].join('\n');

/**
 * Error raised if a users solution function raises an error.
 */
export class UserSolutionThrewError extends Error {
  constructor(cause) {
    super('Your code raised the following Error:', { cause });
    this.message = withOriginalErrorStack(this.message, cause);
    this.name = 'UserSolutionThrewError';
  }
}

/**
 * Error raised if a users solution has a syntax error.
 */
export class UserSolutionSyntaxError extends Error {
  constructor(cause) {
    super('Your solution file has the following Syntax Error:', { cause });
    this.message = withOriginalErrorStack(this.message, cause);
    this.name = 'UserSolutionSyntaxError';
  }
}

/**
 * Error raised if a users solution file is missing the required function.
 */
export class UserSolutionMissingFunctionError extends Error {
  constructor(functionName, ...args) {
    super(
      `Function not found. Your solution file must export function "${functionName}" as a named export.`,
      ...args
    );
    this.name = 'UserSolutionMissingFunctionError';
  }
}
