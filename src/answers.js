import { AnswerTypeInvalidError, AnswerEmptyError } from './errors/index.js';
import { logger } from './logger.js';
import { addOrEditPuzzle, createPuzzle, findPuzzle } from './persistence/puzzleRepository.js';

/**
 * Validates and normalizes a user provided answer.
 * Ensures answer is non empty and is a number or a string.
 * @param {String|Number} answer
 * @throws {AnswerEmptyError}
 * @throws {AnswerTypeInvalidError}
 */
export const parseAnswer = (answer) => {
  if (answer === null || answer === undefined) {
    throw new AnswerEmptyError();
  }

  // only supported type is number or string.
  if (typeof answer !== 'string' && typeof answer !== 'number') {
    throw new AnswerTypeInvalidError(typeof answer);
  }

  const trimmedAnswer = answer.toString().trim();

  // don't allow empty strings.
  if (!trimmedAnswer.length) {
    throw new AnswerEmptyError();
  }

  return trimmedAnswer;
};

/**
 * Has this puzzle already been solved?
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const puzzleHasBeenSolved = async (year, day, part) => {
  const solved = !!(await findPuzzle(year, day, part))?.correctAnswer;
  logger.debug('puzzle is solved: %s', solved, { year, day, part });
  return !!solved;
};

/**
 * Returns the correct answer for this puzzle
 * Returns null if the puzzle has not been solved yet.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @returns {Promise<String>}
 */
export const getCorrectAnswer = async (year, day, part) => {
  const { correctAnswer = null } = await findPuzzle(year, day, part) || {};
  logger.debug('got correct answer for puzzle: %s', correctAnswer, { year, day, part });
  return correctAnswer;
};

/**
 * Stores the correct answer for this puzzle.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {String} correctAnswer
 */
export const setCorrectAnswer = async (year, day, part, correctAnswer) => {
  // Only support string or numer
  if (correctAnswer == null || typeof correctAnswer !== 'string' || typeof correctAnswer !== 'number') {
    throw new AnswerTypeInvalidError(typeof correctAnswer);
  }

  const trimmedAnswer = correctAnswer.toString().trim();

  if (!trimmedAnswer) {
    throw new AnswerEmptyError();
  }

  logger.debug('saving correct answer: "%s"', correctAnswer, { year, day, part });
  const puzzle = await findPuzzle(year, day, part) || createPuzzle(year, day, part);
  const updatedPuzzle = { ...puzzle, correctAnswer: trimmedAnswer };
  await addOrEditPuzzle(updatedPuzzle);
};

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
