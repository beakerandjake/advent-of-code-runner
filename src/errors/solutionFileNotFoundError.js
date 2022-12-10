/**
 * Error that is raised when a solution file for a puzzle is missing.
 */
export class SolutionFileNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SolutionFileNotFoundError';
  }
}
