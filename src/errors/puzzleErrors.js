import { UserError } from './userError.js';

/**
 * Error raised if puzzle does not have level.
 */
export class PuzzleLevelInvalidError extends UserError {
  constructor(day, level, ...args) {
    super(`Day ${day} does not have level ${level}.`, ...args);
    this.name = 'InvalidLevelError';
  }
}
