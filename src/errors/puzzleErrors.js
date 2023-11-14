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
      `You cannot attempt this puzzle because it is not unlocked yet, check back on December ${day} at midnight EST`,
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
