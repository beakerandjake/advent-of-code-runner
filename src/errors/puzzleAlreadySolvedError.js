/**
 * Error that is raised when the user submits the solution to a puzzle
 * which has already been solved.
 */
export class PuzzleAlreadySolvedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PuzzleAlreadySolvedError';
  }
}
