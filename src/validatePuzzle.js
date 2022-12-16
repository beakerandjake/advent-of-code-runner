import { getConfigValue } from './config.js';
import { logger } from './logger.js';

/**
 * Returns true if the value is an integer.
 * @param {Any} value
 */
const isPositiveInteger = (value) => Number.isFinite(value) && Number.isInteger(value) && value > 0;

/**
 * Is the year one where aoc happened?
 * @param {Number} year
 */
export const yearIsValid = (year) => {
  if (!isPositiveInteger(year)) {
    return false;
  }

  return getConfigValue('aoc.puzzleValidation.years').includes(year);
};

/**
 * Is the day one where there is a puzzle?
 * @param {Number} day
 */
export const dayIsValid = (day) => {
  if (!isPositiveInteger(day)) {
    return false;
  }

  return getConfigValue('aoc.puzzleValidation.days').includes(day);
};

/**
 * Is the part a valid puzzle part?
 * @param {Number} part
 */
export const partIsValid = (part) => {
  if (!isPositiveInteger(part)) {
    return false;
  }

  return getConfigValue('aoc.puzzleValidation.parts').includes(part);
};

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
export const getAllPuzzles = (year) => {
  const days = getConfigValue('aoc.puzzleValidation.days');
  const parts = getConfigValue('aoc.puzzleValidation.parts');
  return days.reduce((acc, day) => [...acc, ...parts.map((part) => ({ year, day, part }))], []);
};
