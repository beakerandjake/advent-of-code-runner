import { UserError } from './userError.js';

/**
 * Error raised if puzzle does not have level.
 */
export class PuzzleLevelInvalidError extends UserError {
  constructor(day, level, ...args) {
    super(`Day ${day} does not have level ${level}.`, ...args);
    this.name = 'PuzzleLevelInvalidError';
  }
}

/**
 * Error raised if user attempts puzzle before it is unlocked.
 */
export class PuzzleInFutureError extends UserError {
  //      ``
  constructor(day, ...args) {
    super(
      `This puzzle is not unlocked yet, check back on December ${day} at midnight EST`,
      ...args
    );
    this.name = 'PuzzleInFutureError';
  }
}

/**
 * Error raised if user attempts puzzle level n+1 if level n has not been solved.
 */
export class PuzzleLevelNotMetError extends UserError {
  constructor(day, level, ...args) {
    const previous = level - 1;
    super(
      `Cannot attempt puzzle (day ${day}, level ${level}) because level ${previous} has not been not solved.`,
      ...args
    );
    this.name = 'PuzzleLevelNotMetError';
  }
}

/**
 * Error raised if the puzzle input string was invalid.
 */
export class InvalidPuzzleInputError extends UserError {
  constructor(...args) {
    super(
      'Failed to load data from the input file. You can try deleting this input file and re-downloading it.',
      ...args
    );
    this.name = 'InvalidPuzzleInputError';
  }
}

/**
 * Error raised if user attempts to submit a puzzle that they have already submitted.
 */
export class PuzzleAlreadyCompletedError extends UserError {
  constructor(day, level, ...args) {
    super(
      `Puzzle (day ${day}, level ${level}) has already been submitted.`,
      ...args
    );
    this.name = 'PuzzleAlreadyCompletedError';
  }
}

/**
 * Error raised if user submits an answer to a puzzle that they have already submitted.
 */
export class AnswerAlreadySubmittedError extends UserError {
  constructor(...args) {
    super(`Answer has already been submitted and was incorrect.`, ...args);
    this.name = 'AnswerAlreadySubmittedError';
  }
}
