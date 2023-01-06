import {
  addOrEditPuzzle, createPuzzle, findPuzzle, getPuzzles,
} from './persistence/puzzleRepository.js';
import { parsePositiveInt } from './validation/validationUtils.js';
import { logger } from './logger.js';
import { getConfigValue } from './config.js';
import { average } from './util.js';

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
  const numberSolved = completionData.filter((x) => x.solved);

  return {
    averageNumberOfAttempts: attempts.length ? average(attempts) : null,
    maxAttempts: attempts.length ? Math.max(...attempts) : null,
    averageExecutionTimeNs: executionTimes.length ? average(executionTimes) : null,
    minExecutionTime: executionTimes.length ? Math.min(...executionTimes) : null,
    maxExecutionTime: executionTimes.length ? Math.max(...executionTimes) : null,
    numberSolved: numberSolved.length,
    percentSolved: numberSolved.length ? (numberSolved.length / totalPuzzles) : 0,
    totalPuzzles,
  };
};
