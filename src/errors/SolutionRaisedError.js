/**
 * Error that is raised when an error is raised by a solution.
 */
export class SolutionRaisedError extends Error {
  constructor(message, ...args) {
    super(message, ...args);
    this.name = 'SolutionRaisedError';
  }
}
