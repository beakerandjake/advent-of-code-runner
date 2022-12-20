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
  logger.debug('saving correct answer: "%s"', correctAnswer, { year, day, part });
  const parsedAnswer = parseAnswer(correctAnswer);
  const puzzle = await findPuzzle(year, day, part) || createPuzzle(year, day, part);
  const updatedPuzzle = { ...puzzle, correctAnswer: parsedAnswer };
  await addOrEditPuzzle(updatedPuzzle);
};

/**
 * Stores an incorrect answer for this puzzle.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {String} incorrectAnswer
 */
export const addIncorrectAnswer = async (year, day, part, incorrectAnswer) => {
  logger.debug('saving incorrect answer: "%s"', incorrectAnswer, { year, day, part });

  const parsedAnswer = parseAnswer(incorrectAnswer);
  const puzzle = await findPuzzle(year, day, part) || createPuzzle(year, day, part);

  // bail if incorrect answer is already stored
  if (puzzle.incorrectAnswers.some((x) => answersEqual(x, parsedAnswer))) {
    logger.warn('Attempted to save incorrect answer: "%s" which was already stored', incorrectAnswer, { year, day, part });
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
 * @param {Number} part
 * @param {String} incorrectAnswer
 */
export const answerHasBeenSubmitted = async (year, day, part, answer) => {
  const { correctAnswer = null, incorrectAnswers = [] } = await findPuzzle(year, day, part) || {};

  if (!correctAnswer && incorrectAnswers.length === 0) {
    logger.debug('answer has not been submitted because puzzle has not been saved', { year, day, part });
    return false;
  }

  const toReturn = (correctAnswer && answersEqual(correctAnswer, answer))
    || incorrectAnswers.some((x) => answersEqual(x, answer));

  logger.debug('answer has been submitted: %s', answer, { year, day, part });

  return toReturn;
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
    (puzzle) => puzzle.year === x.year && puzzle.day === x.day && puzzle.part === x.part,
  ));

  logger.debug('found earliest unanswered puzzle', toReturn);

  return toReturn ? { day: toReturn.day, part: toReturn.part } : null;
};

/**
 * Has the user completed the parts required to attempt this puzzle?
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const requiredPartsHaveBeenSolved = async (year, day, part) => {
  // part 1 doesn't have any requirements.
  if (part === 1) {
    return true;
  }
  // generate array of all numbers leading up to part.
  const requiredParts = [...Array(part - 1)].keys().map((x) => x + 1);
  // get all parts for this day that the user has solved.
  const solvedParts = (await getPuzzles())
    .filter((x) => x.year === year && x.day === day && !!x.correctAnswer)
    .map((x) => x.part);
  // check every required part has been solved
  return requiredParts.every((required) => solvedParts.includes(required));
};
