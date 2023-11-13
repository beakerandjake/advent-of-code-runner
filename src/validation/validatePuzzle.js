import { getConfigValue } from '../config.js';

/**
 * Checks to see if the user is attempting a puzzle
 * that is in the future and therefore not unlocked.
 * @param {Number} year
 * @param {Number} day
 */
export const puzzleIsInFuture = (year, day) => {
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
  const levels = getConfigValue('aoc.validation.levels');
  return [
    // days 1-(n-1) has L levels.
    ...days.slice(0, -1).map((day) => levels.map((level) => ({ year, day, level }))),
    // day n has one level.
    { year, day: days.at(-1), level: 1 },
  ].flat();
};

/**
 * Returns the total number of puzzles in advent of code.
 */
export const getTotalPuzzleCount = () => {
  const days = getConfigValue('aoc.validation.days');
  const levels = getConfigValue('aoc.validation.levels');
  // Days 1-(n-1) have L levels, but day n has 1 level.
  return (days.length - 1) * levels.length + 1;
};
