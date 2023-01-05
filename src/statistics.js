import {
  addOrEditPuzzle, createPuzzle, findPuzzle, getPuzzles,
} from './persistence/puzzleRepository.js';
import { parsePositiveInt } from './validation/validationUtils.js';
import { logger } from './logger.js';

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
  logger.debug('setting fastest execution time to: %s', timeNs, { year, day, part });
  return addOrEditPuzzle(updated);
};

/**
 * Returns information about each puzzles completion
 * @param {Number} year
 */
export const getPuzzleCompletionData = async (year) => (await getPuzzles())
  .filter((x) => x.year === year)
  .map(({
    day, part, correctAnswer, fastestExecutionTimeNs, incorrectAnswers,
  }) => ({
    day,
    part,
    solved: !!correctAnswer,
    executionTimeNs: correctAnswer ? fastestExecutionTimeNs : null,
    numberOfAttempts: correctAnswer ? incorrectAnswers.length + 1 : incorrectAnswers.length,
  }));
