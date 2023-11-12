import { requiredLevelsHaveBeenSolved } from '../answers.js';
import { logger } from '../logger.js';

/**
 * Asserts that the user has solved the requisite levels leading up to this puzzles level.
 */
export const assertPuzzleLevelMet = async ({ year, day, level } = {}) => {
  if (!(await requiredLevelsHaveBeenSolved(year, day, level))) {
    logger.error(
      `You cannot attempt this puzzle (day ${day}, level ${level}) because you have not completed the previous levels of this puzzle.`
    );
    return false;
  }
  return true;
};
