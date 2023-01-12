import { puzzleHasBeenSolved } from '../answers.js';
import { logger } from '../logger.js';

/**
 * Returns true if the user has not solved the puzzle
 * Returns false if the user has solved the puzzle.
 */
export const assertPuzzleUnsolved = async ({ year, day, level } = {}) => {
  if (await puzzleHasBeenSolved(year, day, level)) {
    logger.error('You have already solved and submitted the correct answer this puzzle!');
    return false;
  }
  return true;
};
