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
  constructor(answerType, ...args) {
    super(`Unsupported answer type, answer must be a string or number. You provided: "${answerType}".`, ...args);
    this.name = 'UserSolutionAnswerInvalidError';
  }
}

/**
 * Error raised if users solution file cannot be found.
 */
export class UserSolutionFileNotFoundError extends Error {
  constructor(fileName, ...args) {
    super(`Could not import your solution file, ensure file exits: ${fileName}`, ...args);
    this.name = 'UserSolutionFileNotFoundError';
  }
}

/**
 * Creates a new stack trace which merges the message
 * and the original errors stack trace.
 * @param {String} message
 * @param {Error} originalError
 */
const withOriginalErrorStack = (message, originalError) => [
  message,
  `↳ ${originalError?.stack ? originalError.stack : originalError}`,
].join('\n');

/**
 * Error raised if a users solution function raises an error.
 */
export class UserSolutionThrewError extends Error {
  constructor(cause) {
    super('Your function threw the following Error:', { cause });
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
    this.stack = withOriginalErrorStack(this.message, cause);
    this.name = 'UserSolutionSyntaxError';
  }
}

/**
 * Error raised if a users solution file is missing the required function.
 */
export class UserSolutionMissingFunctionError extends Error {
  constructor(functionName, ...args) {
    super(`Function not found. Your solution file must export function "${functionName}" as a named export.`, ...args);
    this.name = 'UserSolutionMissingFunctionError';
  }
}
