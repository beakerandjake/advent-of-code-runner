import { requiredPartsHaveBeenSolved } from '../answers.js';
import { logger } from '../logger.js';

/**
 * Asserts that the user has solved the requisite levels leading up to this puzzles level.
 */
export const assertPuzzleLevelMet = async ({ year, day, part } = {}) => {
  if (!await requiredPartsHaveBeenSolved(year, day, part)) {
    logger.error(`You cannot attempt this puzzle (day ${day}, level ${part}) because you have not completed the previous levels of this puzzle.`);
    return false;
  }
  return true;
};
