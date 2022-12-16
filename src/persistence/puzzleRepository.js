import { UserDataTranslationError } from '../errors/index.js';
import { getStoreValue, setStoreValue } from './jsonFileStore.js';

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
 * Expect the id field of puzzle stored in json is exactly 8 digits.
 * YYYYDDPP (year day part)
 */
const idRegex = /^\d{8}$/;

/**
 * Parses the year, day, part from a valid id.
 * @param {String} id
 */
const parseValidId = (id) => ({
  year: Number.parseInt(id.substring(0, 4), 10),
  day: Number.parseInt(id.substring(4, 6), 10),
  part: Number.parseInt(id.substring(6), 10),
});

/**
 * Converts the raw puzzle object loaded from json into a puzzle object expected by the application.
 * This puzzle object contains additional data which makes coding easier, but would be redundant
 * to store to disk. Therefore we must transform this object. If our persistence layer changes
 * this function would either become obsolete, or would have to change.
 * @private
 * @param {Object} puzzle - The raw puzzle returned from the json.
 */
export const translateToPuzzleFromData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new UserDataTranslationError('Puzzle data invalid, expected a non null object');
  }

  const {
    id,
    correctAnswer = null,
    fastestExecutionTimeNs = null,
    incorrectAnswers = [],
  } = data;

  if (!id || (typeof id !== 'string') || !idRegex.test(id)) {
    throw new UserDataTranslationError(`Puzzle ${id} did not expected format of YYYYDDPP (year day part)`);
  }

  if (!Array.isArray(incorrectAnswers)) {
    throw new UserDataTranslationError('Puzzle "incorrectAnswers" expected to be array');
  }

  if (fastestExecutionTimeNs && !Number.isFinite(fastestExecutionTimeNs)) {
    throw new UserDataTranslationError('Puzzle "fastestExecutionTimeNs" expected to be number');
  }

  return {
    id,
    fastestExecutionTimeNs: fastestExecutionTimeNs && Number.parseInt(fastestExecutionTimeNs, 10),
    incorrectAnswers: incorrectAnswers.map((x) => (x ? x.toString() : '')),
    correctAnswer: correctAnswer?.toString() || null,
    ...parseValidId(id),
  };
};

/**
 * Converts the application puzzle object to the format stored to json file.
 * Removes calculated properties that would be redundant to store to disk.
 * @private
 * @param {Object} puzzle - The raw puzzle returned from the json.
 */
export const translateToDataFromPuzzle = (puzzle) => {
  if (!puzzle || typeof puzzle !== 'object') {
    throw new UserDataTranslationError('Puzzle invalid, expected a non null object');
  }

  const {
    id,
    correctAnswer = null,
    fastestExecutionTimeNs = null,
    incorrectAnswers = [],
  } = puzzle;

  if (!id || typeof id !== 'string' || !idRegex.test(id)) {
    throw new UserDataTranslationError('Puzzle "id" did not expected format of YYYYDDPP (year day part)');
  }

  if (!Array.isArray(incorrectAnswers)) {
    throw new UserDataTranslationError('Puzzle "incorrectAnswers" expected to be array');
  }

  if (fastestExecutionTimeNs && !Number.isFinite(fastestExecutionTimeNs)) {
    throw new UserDataTranslationError('Puzzle "fastestExecutionTimeNs" expected to be number');
  }

  return {
    id,
    fastestExecutionTimeNs: fastestExecutionTimeNs && Number.parseInt(fastestExecutionTimeNs, 10),
    incorrectAnswers: incorrectAnswers.map((x) => (x ? x.toString() : '')),
    correctAnswer: correctAnswer?.toString() || null,
  };
};

/**
 * Generates an id for the puzzle which will be persisted to json.
 * @private
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const getId = (year, day, part) => {
  const toReturn = `${year?.toString().padStart(4)}${day?.toString().padStart(2, '0')}${part?.toString().padStart(2, '0')}`;

  if (!idRegex.test(toReturn)) {
    throw new UserDataTranslationError(`Could not generate valid id from year: "${year}", day: "${day}", part: "${part}"`);
  }
  return toReturn;
};

/**
 * Returns the stored puzzles array.
 * @returns {Promise<Object[]>}
 */
export const getPuzzles = async () => (
  (await getStoreValue(PUZZLE_DATA_KEY, [])).map(translateToPuzzleFromData)
);

/**
 * Updates the stored puzzles array.
 * @param {Object[]} puzzles
 */
export const setPuzzles = async (puzzles = []) => (
  setStoreValue(PUZZLE_DATA_KEY, puzzles.map(translateToDataFromPuzzle))
);

/**
 * Returns the specified puzzle data. If not found, returns null.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const findPuzzle = async (year, day, part) => {
  const puzzles = await getPuzzles();
  const puzzleId = getId(year, day, part);
  return puzzles.find((x) => x.id === puzzleId) || null;
};

/**
 * Returns a new puzzle instance for the given puzzle.
 * This does not persist the instance, it just returns a new one.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const createPuzzle = (year, day, part) => {
  const id = getId(year, day, part);

  return {
    id,
    fastestExecutionTimeNs: null,
    incorrectAnswers: [],
    correctAnswer: null,
    ...parseValidId(id),
  };
};

/**
 * Updates matching puzzle with the new value.
 * If a matching puzzle does not exist, it is inserted.
 * Puzzles are matched by id.
 * @param {Object} puzzle
 */
export const addOrEditPuzzle = async (puzzle) => {
  if (!puzzle) {
    throw new Error('Cannot add or edit a null puzzle');
  }

  // could speed this up, but keeping it simple.

  const puzzles = await getStoreValue(PUZZLE_DATA_KEY, []);

  // edit if exists, add if doesn't
  const updated = puzzles.some((x) => x.id === puzzle.id)
    ? puzzles.map((x) => (x.id === puzzle.id ? translateToDataFromPuzzle(puzzle) : x))
    : [...puzzles, translateToDataFromPuzzle(puzzle)];

  await setStoreValue(PUZZLE_DATA_KEY, updated);
};
