/**
 * Error that is raised when a users solution function raises an error.
 */
export class SolutionRuntimeError extends Error {
  constructor(cause) {
    super(cause?.message || 'Error from solution file.', { cause });
    this.name = 'SolutionRuntimeError';
  }
}
