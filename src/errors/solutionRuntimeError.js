import { UserError } from './userError.js';

/**
 * Error that is raised when a users solution function raises an error.
 */
export class SolutionRuntimeError extends UserError {
  constructor(stack) {
    super(stack);
    this.name = 'SolutionRuntimeError';
  }
}
