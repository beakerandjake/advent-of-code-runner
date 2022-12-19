import { getConfigValue } from './config.js';
import { logger } from './logger.js';

/**
 * has the puzzle been unlocked by aoc?
 * not an issue for past years but for current year
 * it's necessary to ensure we don't attempt puzzles which are in the future
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
  const days = getConfigValue('aoc.puzzleValidation.days');
  const parts = getConfigValue('aoc.puzzleValidation.parts');
  return days.reduce((acc, day) => [...acc, ...parts.map((part) => ({ year, day, part }))], []);
};
