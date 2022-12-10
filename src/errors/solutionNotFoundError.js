import { UserError } from './userError.js';

/**
 * Error that is raised when a solution file for a puzzle is missing.
 */
export class SolutionNotFoundError extends UserError {
  constructor(message) {
    super(message);
    this.name = 'SolutionNotFoundError';
  }
}
