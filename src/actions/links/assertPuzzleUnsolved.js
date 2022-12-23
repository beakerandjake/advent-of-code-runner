import { puzzleHasBeenSolved } from '../../answers.js';
import { logger } from '../../logger.js';

/**
 * Returns true if the user has not solved the puzzle
 * Returns false if the user has solved the puzzle.
 */
export const assertPuzzleUnsolved = async ({ year, day, part } = {}) => {
  if (await puzzleHasBeenSolved(year, day, part)) {
    logger.error('You have already solved and submitted the correct answer this puzzle!');
    return false;
  }
  logger.debug('puzzle has not been previously solved');
  return true;
};
