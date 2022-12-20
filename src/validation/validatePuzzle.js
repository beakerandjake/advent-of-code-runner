import { logger } from '../logger.js';
import { getConfigValue } from '../config.js';

/**
 * Checks to see if the user is attempting a puzzle
 * that is in the future and therefore not unlocked.
 * @param {Number} year
 * @param {Number} day
 */
export const puzzleIsInFuture = (year, day) => {
  logger.warn('not implemented - puzzleIsUnlocked()');
  return false;
};

/**
 * Returns a collection of all puzzles available for the year.
 * Collection is sorted from earliest puzzle to latest puzzle.
 * @param {Number} year
 */
export const getAllPuzzlesForYear = (year) => {
  const days = getConfigValue('aoc.validation.days');
  const parts = getConfigValue('aoc.validation.parts');
  return days.reduce((acc, day) => [...acc, ...parts.map((part) => ({ year, day, part }))], []);
};
