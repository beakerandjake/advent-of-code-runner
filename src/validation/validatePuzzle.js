import { getConfigValue } from '../config.js';

/**
 * Checks to see if the user is attempting a puzzle
 * that is in the future and therefore not unlocked.
 * @param {Number} year
 * @param {Number} day
 */
export const puzzleIsInFuture = (year, day) => {
  // can easily check for past or future years, but current year is where the hard part is.
  if (year !== new Date().getFullYear()) {
    return year > new Date().getFullYear();
  }
  const puzzleUnlockTimeUTC = Date.UTC(year, 11, day, 19);
  return Date.now() < puzzleUnlockTimeUTC;
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
