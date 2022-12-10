import { UserError } from './userError.js';

/**
 * Error that is raised when the user submits the solution to a puzzle
 * which is locked to them, or is one they have already solved
 */
export class LockedOrCompletedPuzzleError extends UserError {
  constructor(message) {
    super(message);
    this.name = 'LockedOrCompletedPuzzleError';
  }
}
