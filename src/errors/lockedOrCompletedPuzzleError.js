import { UserError } from './userError.js';

/**
 * Error that is raised when the user submits the solution to a puzzle
 * which is locked to them, or is one they have already solved
 */
export class LockedOrCompletedPuzzleError extends UserError {
  constructor() {
    super('This puzzle is locked! Either you have not completed the requisite part, or the puzzle has not been released yet!');
    this.name = 'LockedOrCompletedPuzzleError';
  }
}
