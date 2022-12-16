/**
 * Has this puzzle already been solved?
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const puzzleHasBeenSolved = async (year, day, part) => null;

/**
 * Returns the correct answer for this puzzle (if solved, null if not).
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @returns {Promise<String>}
 */
export const getCorrectAnswer = async (year, day, part) => null;

/**
 * Stores the correct answer for this puzzle.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {String} correctAnswer
 */
export const setCorrectAnswer = async (year, day, part, correctAnswer) => null;

/**
 * Stores an incorrect answer for this puzzle.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {String} incorrectAnswer
 */
export const addIncorrectAnswer = async (year, day, part, incorrectAnswer) => null;

/**
 * Has the user previously submitted this answer to advent of code?
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {String} incorrectAnswer
 */
export const answerHasBeenSubmitted = async (year, day, part, answer) => null;

/**
 * Returns the earliest puzzle for which the user has not successfully solved.
 * If the user has solved all puzzles then null is returned.
 * @param {Number} year
 */
export const getNextUnansweredPuzzle = async (year) => null;
