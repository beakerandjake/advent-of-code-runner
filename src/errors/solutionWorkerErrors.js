import { UserError } from './userError.js';

/**
 * Error raised when the Solution Worker thread raises the "error" event.
 */
export class SolutionWorkerUnexpectedError extends UserError {
  constructor(message, ...args) {
    super(`Unexpected error raised by Solution Worker Thread: ${message}`, ...args);
    this.name = 'SolutionWorkerUnexpectedError';
  }
}
