import { difference } from 'lodash-es';
import { getConfigValue } from './config.js';
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
 * Parses the hash and returns the year / day / part
 * @param {String} hash
 */
const parsePuzzleHash = (hash = '') => {
  const [, year, day, part] = hash.match(/(\d+).(\d+).(\d+)/);
  const parsedYear = parseInt(year, 10);
  const parsedDay = parseInt(day, 10);
  const parsedPart = parseInt(part, 10);
  return { year: parsedYear, day: parsedDay, part: parsedPart };
};

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
  logger.debug('puzzle for year: %s, day: %s, part: %s has already been solved: %s', year, day, part, solved);
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

/**
 * Returns the smallest unsolved puzzle for the given year.
 * If no puzzles have been solved that year, returns default of 1.
 * If all puzzles have been solved that year, returns null;
 * @param {Number} year
 */
export const getNextUnsolvedPuzzle = async (year) => {
  const solvedPuzzles = await getStoreValue(SOLVED_PUZZLES_STORE_KEY, []);

  // generate an array of all possible puzzles for the year.
  const days = getConfigValue('aoc.puzzleValidation.days');
  const parts = getConfigValue('aoc.puzzleValidation.parts');
  const allPuzzles = days.reduce(
    (acc, day) => [...acc, ...parts.map((part) => generatePuzzleHash(year, day, part))],
    [],
  );

  // find the earliest puzzle not already solved.
  const hash = difference(allPuzzles, solvedPuzzles)[0];

  if (!hash) {
    return null;
  }

  const { day, part } = parsePuzzleHash(hash);
  return { day, part };
};
