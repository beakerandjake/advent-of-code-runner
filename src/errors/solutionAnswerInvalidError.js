/**
 * Error raised when users solution returns an answer of the wrong type.
 */
export class SolutionAnswerInvalidError extends Error {
  constructor(answer) {
    super(`Unsupported answer type, answer must be a string or number. You provided: "${answer}".`);
    this.name = 'SolutionAnswerInvalidError';
  }
}
