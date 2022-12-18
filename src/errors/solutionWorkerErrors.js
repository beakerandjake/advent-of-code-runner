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
