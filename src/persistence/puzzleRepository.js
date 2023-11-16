import { logger } from '../logger.js';
import { getValue, setValue } from './userDataFile.js';

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
 * YYYYDDLL (year day level)
 */
const idRegex = /^\d{8}$/;

/**
 * Parses the year, day, level from a valid id.
 * @param {String} id
 */
const parseValidId = (id) => ({
  year: Number.parseInt(id.substring(0, 4), 10),
  day: Number.parseInt(id.substring(4, 6), 10),
  level: Number.parseInt(id.substring(6), 10),
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
    throw new TypeError('Puzzle data invalid, expected a non null object');
  }

  const {
    id,
    correctAnswer = null,
    fastestRuntimeNs = null,
    incorrectAnswers = [],
  } = data;

  if (!id || typeof id !== 'string' || !idRegex.test(id)) {
    throw new TypeError(
      `Puzzle ${id} not expected format of YYYYDDLL (year day level)`
    );
  }

  if (!Array.isArray(incorrectAnswers)) {
    throw new TypeError('Puzzle "incorrectAnswers" expected to be array');
  }

  if (fastestRuntimeNs && !Number.isFinite(fastestRuntimeNs)) {
    throw new TypeError('Puzzle "fastestRuntimeNs" expected to be number');
  }

  return {
    id,
    fastestRuntimeNs: fastestRuntimeNs && Number.parseInt(fastestRuntimeNs, 10),
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
    throw new TypeError('Puzzle invalid, expected a non null object');
  }

  const {
    id,
    correctAnswer = null,
    fastestRuntimeNs = null,
    incorrectAnswers = [],
  } = puzzle;

  if (!id || typeof id !== 'string' || !idRegex.test(id)) {
    throw new TypeError(
      'Puzzle "id" not expected format of YYYYDDLL (year day level)'
    );
  }

  if (!Array.isArray(incorrectAnswers)) {
    throw new TypeError('Puzzle "incorrectAnswers" expected to be array');
  }

  if (fastestRuntimeNs && !Number.isFinite(fastestRuntimeNs)) {
    throw new TypeError('Puzzle "fastestRuntimeNs" expected to be number');
  }

  return {
    id,
    fastestRuntimeNs: fastestRuntimeNs && Number.parseInt(fastestRuntimeNs, 10),
    incorrectAnswers: incorrectAnswers.map((x) => (x ? x.toString() : '')),
    correctAnswer: correctAnswer?.toString() || null,
  };
};

/**
 * Generates an id for the puzzle which will be persisted to json.
 * @private
 * @param {Number} year
 * @param {Number} day
 * @param {Number} level
 */
export const getId = (year, day, level) => {
  // prettier-ignore
  const toReturn = `${year?.toString().padStart(4)}${day?.toString().padStart(2, '0')}${level?.toString().padStart(2, '0')}`;

  if (!idRegex.test(toReturn)) {
    throw new TypeError(
      `Could not generate valid id from year: "${year}", day: "${day}", level: "${level}"`
    );
  }
  return toReturn;
};

/**
 * Returns the stored puzzles array.
 * @returns {Promise<Object[]>}
 */
export const getPuzzles = async () =>
  (await getValue(PUZZLE_DATA_KEY, [])).map(translateToPuzzleFromData);

/**
 * Returns all of the puzzles for the year.
 * @param {Number} year
 */
export const getPuzzlesForYear = async (year) => {
  const puzzles = await getPuzzles();
  return puzzles.filter((x) => x.year === year);
};

/**
 * Updates the stored puzzles array.
 * @param {Object[]} puzzles
 */
export const setPuzzles = async (puzzles = []) =>
  setValue(PUZZLE_DATA_KEY, puzzles.map(translateToDataFromPuzzle));

/**
 * Returns the specified puzzle data. If not found, returns null.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} level
 */
export const findPuzzle = async (year, day, level) => {
  const puzzles = await getPuzzles();
  const puzzleId = getId(year, day, level);
  return puzzles.find((x) => x.id === puzzleId) || null;
};

/**
 * Returns a new puzzle instance for the given puzzle.
 * This does not persist the instance, it just returns a new one.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} level
 */
export const createPuzzle = (year, day, level) => {
  const id = getId(year, day, level);

  return {
    id,
    fastestRuntimeNs: null,
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
  if (puzzle == null) {
    throw new Error('Cannot add or edit a null puzzle');
  }

  // could speed this up, but keeping it simple.

  const puzzles = await getValue(PUZZLE_DATA_KEY, []);
  let updated;

  if (puzzles.some((x) => x.id === puzzle.id)) {
    // update if exists
    logger.debug('puzzle data already exists, updating entry', {
      year: puzzle.year,
      day: puzzle.day,
      level: puzzle.level,
    });
    updated = puzzles.map((x) =>
      x.id === puzzle.id ? translateToDataFromPuzzle(puzzle) : x
    );
  } else {
    // add if does not exist
    logger.debug('puzzle data does not exist, creating entry', {
      year: puzzle.year,
      day: puzzle.day,
      level: puzzle.level,
    });
    updated = [...puzzles, translateToDataFromPuzzle(puzzle)];
  }

  await setValue(PUZZLE_DATA_KEY, updated);
};
