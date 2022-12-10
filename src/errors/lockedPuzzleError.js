import { UserError } from './userError.js';

/**
 * Error that is raised when the user tries access a puzzle
 * that is not yet available to them. Either because the puzzle
 * is in the future, or they have not met a prerequisite to unlock it.
 */
export class LockedPuzzleError extends UserError {
  constructor(message) {
    super(message);
    this.name = 'LockedPuzzleError';
  }
}
