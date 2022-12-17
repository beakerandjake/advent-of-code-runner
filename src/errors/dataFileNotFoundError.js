import { UserError } from './userError.js';

/**
 * Error that is raised when the user submits the solution to a puzzle
 * which is locked to them, or is one they have already solved
 */
export class DataFileNotFoundError extends UserError {
  constructor(fileName, ...args) {
    super(`Could not find data file at: "${fileName}". This file should have been created during the "init" command.`, ...args);
    this.name = 'LockedOrCompletedPuzzleError';
  }
}
