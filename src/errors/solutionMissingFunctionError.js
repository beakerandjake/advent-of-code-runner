/**
 * Error that is raised when a solution file is missing a required function.
 */
export class SolutionMissingFunctionError extends Error {
  constructor(functionName) {
    super(`Solution file must export function "${functionName}" as a named export.`);
    this.name = 'SolutionMissingFunctionError';
  }
}
