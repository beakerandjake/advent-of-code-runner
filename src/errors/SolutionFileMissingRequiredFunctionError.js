/**
 * Error that is raised when a solution file is missing a required function.
 */
export class SolutionFileMissingRequiredFunctionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SolutionFileMissingRequiredFunctionError';
  }
}
