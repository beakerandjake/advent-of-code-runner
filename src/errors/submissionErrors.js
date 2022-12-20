import { UserError } from './userError.js';

/**
 * Error that is raised if the user tries to submit an answer to a puzzle they have already solved.
 */
export class PuzzleHasBeenSolvedError extends UserError {
  constructor(...args) {
    super('You have already solved this puzzle!', ...args);
    this.name = 'PuzzleHasBeenSolvedError';
  }
}

/**
 * Error that is raised if the user tries to submit an duplicate answer to a puzzle.
 */
export class DuplicateAnswerSubmittedError extends UserError {
  constructor(...args) {
    super('You have already submitted this answer for this puzzle!', ...args);
    this.name = 'DuplicateAnswerSubmittedError';
  }
}
