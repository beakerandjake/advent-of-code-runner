import { logger } from './logger.js';
import { getStoreValue, setStoreValue } from './store.js';

/**
 * The key used in the data store where the puzzles array is stored.
 */
const PUZZLE_DATA_KEY = 'puzzles';

/**
 * Generates an id for the year / day / part combination.
 * Makes some operations easier to just pass around id vs 3 params.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @returns
 */
const puzzleId = (year, day, part) => `${year}${day}${part}`;

/**
 * Creates a new default puzzle object which can be persisted.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
const createPuzzle = (year, day, part) => ({
  id: puzzleId(year, day, part),
  year,
  day,
  part,
  correctAnswer: null,
  fastestExecutionTimeNs: null,
  incorrectAnswers: [],
});

/**
 * Returns the stored puzzles array.
 * @returns {Promise<Object[]>}
 */
const getPuzzles = async () => getStoreValue(PUZZLE_DATA_KEY, []);

/**
 * Updates the stored puzzles array.
 * @param {Object[]} puzzles
 */
const setPuzzles = async (puzzles = []) => setStoreValue(PUZZLE_DATA_KEY, puzzles);

/**
 * If the puzzle exists in the puzzles array
 * The element is set to the updated puzzle.
 * Otherwise the updated puzzle is added to the end of the array.
 * The original array is not modified and a new array is returned.
 * @param {Object} puzzle
 * @param {Object[]} puzzles
 */
const addOrUpdatePuzzle = (puzzle, puzzles = []) => {
  let found = false;

  const mapped = puzzles.map((x) => {
    if (x.id === puzzle.id) {
      found = true;
      return puzzle;
    }
    return x;
  });

  return found ? mapped : [...mapped, puzzle];
};

/**
 * Returns the stored data for the specified puzzle, if any.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {Object[]} puzzles
 */
const findPuzzle = (id, puzzles = []) => puzzles.find((puzzle) => puzzle.id === id);

/**
 * Has this puzzle already been solved?
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const puzzleHasBeenSolved = async (year, day, part) => {
  logger.debug('checking if puzzle for year: %s, part:%s, day: %s has been solved', year, day, part);
  const solved = !!findPuzzle(puzzleId(year, day, part), await getPuzzles())?.correctAnswer;
  logger.debug('has been solved: %s', solved);
  return solved;
};

/**
 * Store the fact that the puzzle has been solved.
 * Prevents re-submissions of already solved puzzles.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const setPuzzleSolved = async (year, day, part, correctAnswer, fastestExecutionTimeNs) => {
  logger.festive('Storing the fact that you solved this puzzle');

  if (!correctAnswer) {
    throw new Error('Cannot store an empty value for a puzzles correctAnswer field');
  }

  const puzzles = await getPuzzles();
  const puzzle = findPuzzle(puzzleId(year, day, part), puzzles) || createPuzzle(year, day, part);
  const changes = { ...puzzle, correctAnswer, fastestExecutionTimeNs };
  await setPuzzles(addOrUpdatePuzzle(changes, puzzles));
};

/**
 * Returns the smallest unsolved puzzle for the given year.
 * If no puzzles have been solved that year, returns default of 1.
 * If all puzzles have been solved that year, returns null;
 * @param {Number} year
 */
export const getNextUnsolvedPuzzle = async (year) => {
  throw new Error('Not Implemented');
};
