import {
  addOrEditPuzzle, createPuzzle, findPuzzle, getPuzzlesForYear,
} from './persistence/puzzleRepository.js';
import { parsePositiveInt } from './validation/validationUtils.js';
import { logger } from './logger.js';
import { getConfigValue } from './config.js';
import { average } from './util.js';

/**
 * Returns the fastest runtime for the puzzle.
 * Returns null if the puzzle has not been correctly solved.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const getPuzzlesFastestRuntime = async (year, day, part) => {
  const puzzle = await findPuzzle(year, day, part);
  return puzzle?.fastestExecutionTimeNs || null;
};

/**
 * Sets the fastest runtime for the puzzle.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {Number} timeNs
 */
export const setPuzzlesFastestRuntime = async (year, day, part, timeNs) => {
  const parsed = parsePositiveInt(timeNs);
  const puzzle = await findPuzzle(year, day, part) || createPuzzle(year, day, part);
  const updated = { ...puzzle, fastestExecutionTimeNs: parsed };
  logger.debug('setting fastest execution time to: %s', timeNs, { year, day, part });
  return addOrEditPuzzle(updated);
};

/**
 * Returns the fastest runtime across across all the years puzzles.
 * @param {Number} year
 */
export const getFastestRuntime = async (year) => {
  const puzzles = await getPuzzlesForYear(year);
  const runtimes = puzzles.map((x) => x.fastestExecutionTimeNs);
  return runtimes.length ? Math.min(...runtimes) : null;
};

/**
 * Returns the slowest runtime across all the years puzzles.
 * @param {Number} year
 */
export const getSlowestRuntime = async (year) => {
  const puzzles = await getPuzzlesForYear(year);
  const runtimes = puzzles.map((x) => x.fastestExecutionTimeNs);
  return runtimes.length ? Math.max(...runtimes) : null;
};

/**
 * Returns the average runtime across all the years puzzles.
 * @param {Number} year
 */
export const getAverageRuntime = async (year) => {
  const puzzles = await getPuzzlesForYear(year);
  const runtimes = puzzles.map((x) => x.fastestExecutionTimeNs);
  return runtimes.length ? average(runtimes) : null;
};

/**
 * Returns the max number of attempts across all the years puzzles.
 * @param {Number} year
 */
export const getMaxAttempts = async (year) => {
  const puzzles = await getPuzzlesForYear(year);
  const attempts = puzzles.map((x) => x.incorrectAnswers.length + (x.correctAnswer ? 1 : 0));
  return attempts.length ? Math.max(...attempts) : null;
};

/**
 * Returns the average number of attempts across all the years puzzles.
 * @param {Number} year
 */
export const getAverageAttempts = async (year) => {
  const puzzles = await getPuzzlesForYear(year);
  const attempts = puzzles.map((x) => x.incorrectAnswers.length + (x.correctAnswer ? 1 : 0));
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
    .map(({
      day, part, correctAnswer, fastestExecutionTimeNs, incorrectAnswers,
    }) => ({
      day,
      part,
      solved: !!correctAnswer,
      executionTimeNs: correctAnswer ? fastestExecutionTimeNs : null,
      numberOfAttempts: correctAnswer ? incorrectAnswers.length + 1 : incorrectAnswers.length,
    }));
};

/**
 * Summarizes the results returned by getPuzzleCompletionData()
 * @param {Object[]} completionData
 */
export const summarizeCompletionData = (completionData = []) => {
  if (!Array.isArray(completionData)) {
    throw new TypeError('expected completion data to be an array');
  }

  const totalPuzzles = getConfigValue('aoc.validation.days').length * getConfigValue('aoc.validation.parts').length;

  if (totalPuzzles <= 0) {
    throw new RangeError('expected total puzzles to be a positive number');
  }

  const attempts = completionData.map((x) => x.numberOfAttempts).filter((x) => x != null);
  const executionTimes = completionData.map((x) => x.executionTimeNs).filter((x) => x != null);
  const numberSolved = completionData.filter((x) => x.solved).length;

  return {
    averageNumberOfAttempts: attempts.length ? average(attempts) : null,
    maxAttempts: attempts.length ? Math.max(...attempts) : null,
    averageExecutionTimeNs: executionTimes.length ? average(executionTimes) : null,
    minExecutionTime: executionTimes.length ? Math.min(...executionTimes) : null,
    maxExecutionTime: executionTimes.length ? Math.max(...executionTimes) : null,
    numberSolved,
    totalPuzzles,
  };
};
