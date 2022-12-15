import { getStoreValue, setStoreValue } from './jsonFileStore';

/**
 * This repository serves as an abstraction between how the data is stored
 * and using that data. We can change how the data is stored by changing only this layer
 * instead of changing the whole application.
 */

/**
 * The key used in the data store where the puzzles array is stored.
 */
const PUZZLE_DATA_KEY = 'puzzles';

/**
 * Converts the puzzle loaded from json into a puzzle object expected by the application.
 * This puzzle object contains additional data which makes coding easier, but would be redundant
 * to store to disk.
 * @param {Object} puzzle - The raw puzzle returned from the json.
 */
const transformPuzzleFromData = ({
  id,
  correctAnswer,
  fastestExecutionTimeNs,
  incorrectAnswers,
}) => {
  if (!id || id.length !== 8 || !Number.parseInt(id, 10)) {
    throw new Error('Id did not match expected format of YYYYDDPP (year day part)');
  }

  return {
    id,
    correctAnswer,
    fastestExecutionTimeNs,
    incorrectAnswers,
    year: id.substring(0, 4),
    day: id.substring(4, 6),
    part: id.substring(6),
  };
};

/**
 * Returns the stored puzzles array.
 * @returns {Promise<Object[]>}
 */
export const getPuzzles = async () => getStoreValue(PUZZLE_DATA_KEY, []);

/**
 * Updates the stored puzzles array.
 * @param {Object[]} puzzles
 */
export const setPuzzles = async (puzzles = []) => setStoreValue(PUZZLE_DATA_KEY, puzzles);
