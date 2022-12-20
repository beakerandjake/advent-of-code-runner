import { addOrEditPuzzle, createPuzzle, findPuzzle } from './persistence/puzzleRepository.js';
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
  const puzzle = await findPuzzle(year, day, part) || createPuzzle(year, day, part);
  const updated = { ...puzzle, fastestExecutionTimeNs: parsed };
  return addOrEditPuzzle(updated);
};
