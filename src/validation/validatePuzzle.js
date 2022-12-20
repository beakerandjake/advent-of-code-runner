import { logger } from '../logger.js';
import { getConfigValue } from '../config.js';

/**
 * Checks if the puzzle is unlocked on advent of code.
 * @param {Number} year
 * @param {Number} day
 */
export const puzzleIsUnlocked = (year, day) => {
  logger.warn('not implemented - puzzleIsUnlocked()');
  return true;
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
