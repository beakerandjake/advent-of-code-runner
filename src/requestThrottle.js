/**
 * Store the Date of the last request made to the aoc servers.
 * @param {Date} date
 */
export const setLastRequestTime = (date) => {};

/**
 * Get the Date of the last request made to the aoc servers.
 */
export const getLastRequestTime = () => new Date();

/**
 * Store the fact that the puzzle has been solved.
 * Prevents re-submissions of already solved puzzles.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const setPuzzleSolved = (year, day, part) => {};

/**
 * Has this puzzle already been solved?
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const hasPuzzleBeenSolved = (year, day, part) => {};
