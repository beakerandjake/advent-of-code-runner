/**
 * Error that is raised when an error is raised by a solution.
 */
export class SolutionRaisedError extends Error {
  constructor(message, originalError) {
    super(message);
    this.originalError = originalError;
    this.name = 'SolutionRaisedError';
  }
}
