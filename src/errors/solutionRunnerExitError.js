/**
 * Error raised when a solution runner worker thread exits without sending a solution message.
 */
export class SolutionRunnerExitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SolutionRunnerExitError';
  }
}
