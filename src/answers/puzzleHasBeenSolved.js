import { logger } from '../logger.js';
import { findPuzzle } from '../persistence/puzzleRepository.js';

/**
 * Has this puzzle already been solved?
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const puzzleHasBeenSolved = async (year, day, part) => {
  logger.debug('checking if puzzle for year: %s, part:%s, day: %s has been solved', year, day, part);

  const solved = !!(await findPuzzle(year, day, part))?.correctAnswer;

  logger.debug('has been solved: %s', solved);

  return solved;
};
