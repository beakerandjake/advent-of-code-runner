import { logger } from '../../logger.js';
import { puzzleIsInFuture } from '../../validation/validatePuzzle.js';

/**
 * Halts execution if the puzzle is not yet unlocked on advent of code.
 */
export const assertPuzzleIsUnlocked = ({ year, day }) => {
  logger.debug('checking if puzzle is unlocked', { year, day });
  // puzzle is unlocked if its not in the future.
  if (puzzleIsInFuture(year, day)) {
    logger.error(`You cannot attempt this puzzle because it is not unlocked yet, check back on December ${day} at midnight EST`);
    return false;
  }

  return true;
};
