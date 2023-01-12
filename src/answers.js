import { logger } from './logger.js';
import { answerTypeIsValid } from './validation/validateAnswer.js';
import { getAllPuzzlesForYear } from './validation/validatePuzzle.js';
import {
  addOrEditPuzzle,
  createPuzzle,
  findPuzzle,
  getPuzzles,
} from './persistence/puzzleRepository.js';

/**
 * Validates and normalizes a user provided answer.
 * Ensures answer is non empty and is a number or a string.
 * @param {String|Number} answer
 * @throws {AnswerEmptyError}
 * @throws {AnswerTypeInvalidError}
 */
export const parseAnswer = (answer) => {
  if (!answerTypeIsValid(answer)) {
    throw new TypeError('Answer type is invalid');
  }

  const trimmedAnswer = answer.toString().trim();

  // don't allow empty strings.
  if (!trimmedAnswer.length) {
    throw new RangeError('Answer was empty');
  }

  return trimmedAnswer;
};

/**
 * Performs case insensitive comparison of answers.
 * @param {String|Number} lhs
 * @param {String|Number} rhs
 */
export const answersEqual = (lhs, rhs) => (
  lhs?.toString().toLowerCase() === rhs?.toString().toLowerCase()
);

/**
 * Has this puzzle already been solved?
 * @param {Number} year
 * @param {Number} day
 * @param {Number} level
 */
export const puzzleHasBeenSolved = async (year, day, level) => {
  const { correctAnswer } = await findPuzzle(year, day, level) || {};
  return !!correctAnswer;
};

/**
 * Returns the correct answer for this puzzle
 * Returns null if the puzzle has not been solved yet.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} level
 * @returns {Promise<String>}
 */
export const getCorrectAnswer = async (year, day, level) => {
  const { correctAnswer = null } = await findPuzzle(year, day, level) || {};
  return correctAnswer;
};

/**
 * Stores the correct answer for this puzzle.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} level
 * @param {String} correctAnswer
 */
export const setCorrectAnswer = async (year, day, level, correctAnswer) => {
  logger.debug('saving correct answer: "%s"', correctAnswer, { year, day, level });
  const parsedAnswer = parseAnswer(correctAnswer);
  const puzzle = await findPuzzle(year, day, level) || createPuzzle(year, day, level);
  const updatedPuzzle = { ...puzzle, correctAnswer: parsedAnswer };
  await addOrEditPuzzle(updatedPuzzle);
};

/**
 * Stores an incorrect answer for this puzzle.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} level
 * @param {String} incorrectAnswer
 */
export const addIncorrectAnswer = async (year, day, level, incorrectAnswer) => {
  logger.debug('saving incorrect answer: "%s"', incorrectAnswer, { year, day, level });

  const parsedAnswer = parseAnswer(incorrectAnswer);
  const puzzle = await findPuzzle(year, day, level) || createPuzzle(year, day, level);

  // bail if incorrect answer is already stored
  if (puzzle.incorrectAnswers.some((x) => answersEqual(x, parsedAnswer))) {
    logger.warn('Attempted to save incorrect answer: "%s" which was already stored', incorrectAnswer, { year, day, level });
    return;
  }

  await addOrEditPuzzle({
    ...puzzle,
    incorrectAnswers: [...puzzle.incorrectAnswers, parsedAnswer],
  });
};

/**
 * Has the user previously submitted this answer to advent of code?
 * @param {Number} year
 * @param {Number} day
 * @param {Number} level
 * @param {String} incorrectAnswer
 */
export const answerHasBeenSubmitted = async (year, day, level, answer) => {
  const { correctAnswer = null, incorrectAnswers = [] } = await findPuzzle(year, day, level) || {};

  if (incorrectAnswers.some((x) => answersEqual(x, answer))) {
    return true;
  }

  return !!correctAnswer && answersEqual(correctAnswer, answer);
};

/**
 * Returns the earliest puzzle for which the user has not successfully solved.
 * If the user has solved all puzzles then null is returned.
 * @param {Number} year
 */
export const getNextUnansweredPuzzle = async (year) => {
  const allPuzzles = getAllPuzzlesForYear(year);
  const answeredPuzzles = (await getPuzzles()).filter((x) => !!x.correctAnswer);
  const toReturn = allPuzzles.find((x) => !answeredPuzzles.some(
    (puzzle) => puzzle.year === x.year && puzzle.day === x.day && puzzle.level === x.level,
  ));
  return toReturn ? { day: toReturn.day, level: toReturn.level } : null;
};

/**
 * Has the user completed the requisite levels for the puzzle?
 * @param {Number} year
 * @param {Number} day
 * @param {Number} level
 */
export const requiredLevelsHaveBeenSolved = async (year, day, level) => {
  // level 1 doesn't have any requirements.
  if (level === 1) {
    return true;
  }
  // generate array of all numbers leading up to level.
  const requiredParts = [...Array(level - 1).keys()].map((x) => x + 1);
  // get all levels for this day that the user has solved.
  const solvedParts = (await getPuzzles())
    .filter((x) => x.year === year && x.day === day && !!x.correctAnswer)
    .map((x) => x.level);
  // check every required level has been solved
  return requiredParts.every((required) => solvedParts.includes(required));
};
