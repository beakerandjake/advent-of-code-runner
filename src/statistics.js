import {
  addOrEditPuzzle,
  createPuzzle,
  findPuzzle,
  getPuzzlesForYear,
} from './persistence/puzzleRepository.js';
import { parsePositiveInt } from './validation/validationUtils.js';
import { logger } from './logger.js';
import { average } from './util.js';

/**
 * Compares the runtime to the fastest runtime for the puzzle.
 * Always returns false if the puzzle has not been solved.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} level
 * @param {Number} runtimeNs
 */
export const beatsFastestRuntime = async (year, day, level, runtimeNs) => {
  const puzzle = await findPuzzle(year, day, level);
  if (!puzzle?.fastestRuntimeNs) {
    return false;
  }
  return runtimeNs < puzzle.fastestRuntimeNs;
};

/**
 * Sets the fastest runtime for the puzzle.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} level
 * @param {Number} timeNs
 */
export const setPuzzlesFastestRuntime = async (year, day, level, timeNs) => {
  const parsed = parsePositiveInt(timeNs);
  const puzzle =
    (await findPuzzle(year, day, level)) || createPuzzle(year, day, level);
  const updated = { ...puzzle, fastestRuntimeNs: parsed };
  logger.debug('setting fastest runtime to: %s', timeNs, { year, day, level });
  return addOrEditPuzzle(updated);
};

/**
 * Returns the fastest runtime across across all the years puzzles.
 * @param {Number} year
 */
export const getFastestRuntime = async (year) => {
  const puzzles = await getPuzzlesForYear(year);
  const runtimes = puzzles.map((x) => x.fastestRuntimeNs);
  return runtimes.length ? Math.min(...runtimes) : null;
};

/**
 * Returns the slowest runtime across all the years puzzles.
 * @param {Number} year
 */
export const getSlowestRuntime = async (year) => {
  const puzzles = await getPuzzlesForYear(year);
  const runtimes = puzzles.map((x) => x.fastestRuntimeNs);
  return runtimes.length ? Math.max(...runtimes) : null;
};

/**
 * Returns the average runtime across all the years puzzles.
 * @param {Number} year
 */
export const getAverageRuntime = async (year) => {
  const puzzles = await getPuzzlesForYear(year);
  const runtimes = puzzles.map((x) => x.fastestRuntimeNs);
  return runtimes.length ? average(runtimes) : null;
};

/**
 * Returns the max number of attempts across all the years puzzles.
 * @param {Number} year
 */
export const getMaxAttempts = async (year) => {
  const puzzles = await getPuzzlesForYear(year);
  const attempts = puzzles.map(
    (x) => x.incorrectAnswers.length + (x.correctAnswer ? 1 : 0)
  );
  return attempts.length ? Math.max(...attempts) : null;
};

/**
 * Returns the average number of attempts across all the years puzzles.
 * @param {Number} year
 */
export const getAverageAttempts = async (year) => {
  const puzzles = await getPuzzlesForYear(year);
  const attempts = puzzles.map(
    (x) => x.incorrectAnswers.length + (x.correctAnswer ? 1 : 0)
  );
  return attempts.length ? average(attempts) : null;
};

/**
 * Returns the number solved across all the years puzzles.
 * @param {Number} year
 */
export const getSolvedCount = async (year) => {
  const puzzles = await getPuzzlesForYear(year);
  return puzzles.filter((x) => !!x.correctAnswer).length;
};

/**
 * Returns information about each puzzles completion
 * @param {Number} year
 */
export const getPuzzleCompletionData = async (year) => {
  const puzzles = await getPuzzlesForYear(year);
  return puzzles
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(
      ({ day, level, correctAnswer, fastestRuntimeNs, incorrectAnswers }) => ({
        day,
        level,
        solved: !!correctAnswer,
        runtimeNs: correctAnswer ? fastestRuntimeNs : null,
        numberOfAttempts: correctAnswer
          ? incorrectAnswers.length + 1
          : incorrectAnswers.length,
      })
    );
};
