/**
 * Error that is raised when a users solution function raises an error.
 */
export class SolutionRuntimeError extends Error {
  constructor(stack) {
    super('Your code threw an error!');
    this.stack = stack;
    this.name = 'SolutionRuntimeError';
  }
}
