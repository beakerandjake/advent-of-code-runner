/**
 * Error that is raised when the user is submitting solutions too frequently
 */
export class TooManySubmissionsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TooManySubmissionsError';
  }
}
