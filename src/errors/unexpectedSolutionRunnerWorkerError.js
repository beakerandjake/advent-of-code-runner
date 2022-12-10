/**
 * Raised when the solution runner worker thread raises an unexpected exception.
 */
export class UnexpectedSolutionRunnerWorkerError extends Error {
  constructor(cause) {
    super(cause?.message || 'Unexpected Error from Solution Runner Worker', { cause });
    this.name = 'UnexpectedSolutionRunnerWorkerError';
  }
}
