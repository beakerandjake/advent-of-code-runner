import { UserDataTranslationError } from '../errors/index.js';
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
 * Converts the raw puzzle object loaded from json into a puzzle object expected by the application.
 * This puzzle object contains additional data which makes coding easier, but would be redundant
 * to store to disk. Therefore we must transform this object. If our persistence layer changes
 * this function would either become obsolete, or would have to change.
 * @param {Object} puzzle - The raw puzzle returned from the json.
 * @private
 */
export const translateToPuzzle = (data) => {
  if (!data) {
    throw new UserDataTranslationError('Puzzle data was null');
  }

  const {
    id,
    correctAnswer,
    fastestExecutionTimeNs,
    incorrectAnswers,
  } = data;

  if (!id || id.length !== 8 || !Number.parseInt(id, 10)) {
    throw new UserDataTranslationError('Puzzle "id" did not expected format of YYYYDDPP (year day part)');
  }

  if (fastestExecutionTimeNs && !Number.isInteger(fastestExecutionTimeNs)) {
    throw new UserDataTranslationError('Puzzle "fastestExecutionTimeNs" expected to be number');
  }

  if (!Array.isArray(incorrectAnswers)) {
    throw new UserDataTranslationError('Puzzle "incorrectAnswers" expected to be array');
  }

  return {
    id,
    fastestExecutionTimeNs,
    incorrectAnswers: incorrectAnswers.map((x) => (x ? x.toString() : '')),
    correctAnswer: correctAnswer?.toString(),
    year: Number.parseInt(id.substring(0, 4), 10),
    day: Number.parseInt(id.substring(4, 6), 10),
    part: Number.parseInt(id.substring(6), 10),
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
