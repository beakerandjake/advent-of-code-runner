import { requiredPartsHaveBeenSolved } from '../../answers.js';
import { logger } from '../../logger.js';

/**
 * Asserts that the user has solved the requisite levels leading up to this puzzles level.
 */
export const assertPuzzleLevelMet = async ({ year, day, part } = {}) => {
  logger.verbose('checking if puzzle level is unlocked');

  if (!await requiredPartsHaveBeenSolved(year, day, part)) {
    logger.error(`You cannot attempt this puzzle (day ${day}, level ${part}) because you have not completed the previous levels of this puzzle.`);
    return false;
  }
  logger.verbose('puzzle level is unlocked, all required levels leading up to this one have been solved.');
  return true;
};
