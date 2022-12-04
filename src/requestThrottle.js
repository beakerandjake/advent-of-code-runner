// create throttle.json file at root and store data in it.
// { lastRequestTime: iso8601String, solvedPuzzles: ['puzzle hash']}

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
 * Generates a key to identify the puzzle for the specific year/day/part combination.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
const generatePuzzleKey = (year, day, part) => `${year}_${day}_${part}`;

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
