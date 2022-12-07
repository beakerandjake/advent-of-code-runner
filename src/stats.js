import { logger } from './logger.js';
import { getStoreValue, setStoreValue } from './store.js';

/**
 * The key used in the data store where the last request time value is saved.
 */
const SOLVED_PUZZLES_STORE_KEY = 'solvedPuzzles';

/**
 * Generates a hash from the puzzles specific year/day/part combination.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
const generatePuzzleHash = (year, day, part) => `${year}.${day}.${part}`;

/**
 * Has this puzzle already been solved?
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const puzzleHasBeenSolved = async (year, day, part) => {
  const solvedPuzzles = await getStoreValue(SOLVED_PUZZLES_STORE_KEY, []);
  const hash = generatePuzzleHash(year, day, part);
  const solved = solvedPuzzles.includes(hash);
  logger.debug('solved puzzles includes year: %s, day: %s, part: %s? %s', year, day, part, solved);
  return solved;
};

/**
 * Store the fact that the puzzle has been solved.
 * Prevents re-submissions of already solved puzzles.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const setPuzzleSolved = async (year, day, part) => {
  logger.debug('marking puzzle year: %s, day: %s, part: %s as solved', year, day, part);

  const solvedPuzzles = await getStoreValue(SOLVED_PUZZLES_STORE_KEY, []);
  const hash = generatePuzzleHash(year, day, part);

  if (solvedPuzzles.includes(hash)) {
    logger.warn('attempted to set already solved puzzle: %s.%s.%s as solved', year, day, part);
    return;
  }

  await setStoreValue(SOLVED_PUZZLES_STORE_KEY, [...solvedPuzzles, hash]);
};
