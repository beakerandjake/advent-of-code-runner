/**
 * Error that is raised when the user tries access a puzzle
 * that is not yet available to them. Either because the puzzle
 * is in the future, or they have not met a prerequisite to unlock it.
 */
export class LockedPuzzleError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LockedPuzzleError';
  }
}
