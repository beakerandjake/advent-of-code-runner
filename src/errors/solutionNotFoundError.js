import { UserError } from './userError.js';

/**
 * Error that is raised when a solution file for a puzzle is missing.
 */
export class SolutionNotFoundError extends UserError {
  constructor(fileName) {
    super(`Could not find your solution file, ensure file exits: ${fileName}`);
    this.name = 'SolutionNotFoundError';
  }
}
