import { logger } from './logger.js';
import { addOrEditPuzzle, findPuzzle } from './persistence/puzzleRepository.js';
import { parsePositiveInt } from './validation/validationUtils.js';

/**
 * Returns the fastest execution time for the puzzle.
 * Returns null if the puzzle has not been correctly solved.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const getFastestExecutionTime = async (year, day, part) => {
  const puzzle = await findPuzzle(year, day, part);
  return puzzle?.fastestExecutionTimeNs || null;
};

/**
 * Sets the fastest execution time for the puzzle.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {Number} timeNs
 */
export const setFastestExecutionTime = async (year, day, part, timeNs) => {
  const parsed = parsePositiveInt(timeNs);
  const puzzle = await findPuzzle(year, day, part);
  const updated = { ...puzzle, fastestExecutionTimeNs: parsed };
  return addOrEditPuzzle(updated);
};

/**
 *
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {Number} timeNs
 */
export const tryToSetFastestExecutionTime = async (year, day, part, timeNs) => {
  if (!Number.isFinite(timeNs) || timeNs <= 0) {
    throw new Error('Attempted to set fastest execution time to non numeric or negative value');
  }

  const puzzle = await findPuzzle(year, day, part);

  if (!puzzle) {
    logger.warn('attempted to set fasted execution time on puzzle which was not saved');
    return;
  }

  if (puzzle.fastestExecutionTimeNs && (timeNs >= puzzle.fastestExecutionTimeNs)) {
    logger.debug('not setting fastest execution time, execution time: %s was slower than stored fastest: %s', timeNs, puzzle.fastestExecutionTimeNs);
    return;
  }

  logger.festive('That\'s your fastest execution time ever for this puzzle!');
  const updates = { ...puzzle, fastestExecutionTimeNs: timeNs };
  await addOrEditPuzzle(updates);
};
