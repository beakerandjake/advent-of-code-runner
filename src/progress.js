import { logger } from './logger.js';
import { findPuzzle } from './repositories/puzzleRepository.js';

/**
 * Has this puzzle already been solved?
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const puzzleHasBeenSolved = async (year, day, part) => {
  logger.debug('checking if puzzle for year: %s, part:%s, day: %s has been solved', year, day, part);
  const solved = !!(await findPuzzle(year, day, part))?.correctAnswer;
  logger.debug('has been solved: %s', solved);
  return solved;
};

/**
 * Store the fact that the puzzle has been solved.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {String|Number} correctAnswer
 */
export const setPuzzleSolved = async (year, day, part, answer, executionTimeNs) => {
  logger.festive('Storing the fact that you solved this puzzle');

  if (!answer) {
    throw new Error('Cannot store an empty correct answer');
  }
};

/**
 * Store the fact that the puzzle has been solved.
 * Prevents re-submissions of already solved puzzles.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {String|Number} correctAnswer
 */
export const setCorrectAnswer = async (
  year,
  day,
  part,
  correctAnswer,
  fastestExecutionTimeNs,
) => {
  logger.festive('Storing the fact that you solved this puzzle');

  if (!correctAnswer) {
    throw new Error('Cannot store an empty correct answer');
  }

  const puzzles = await getPuzzles();
  const puzzle = findPuzzle(puzzleId(year, day, part), puzzles) || createPuzzle(year, day, part);
  const changes = { ...puzzle, correctAnswer: correctAnswer.toString(), fastestExecutionTimeNs };
  await setPuzzles(addOrUpdatePuzzle(changes, puzzles));
};

/**
 * Stores the puzzles incorrect answer.
 * Prevents re-submissions of wrong answers.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {String|Number} incorrectAnswer
 */
export const addIncorrectAnswer = async (year, day, part, incorrectAnswer) => {
  logger.festive('Storing incorrect answer so it\'s not re-submitted.');

  if (!incorrectAnswer) {
    throw new Error('Cannot store an empty incorrect answer');
  }

  const puzzles = await getPuzzles();
  const puzzle = findPuzzle(puzzleId(year, day, part), puzzles) || createPuzzle(year, day, part);

  // prevent duplicate storage.
  if (puzzle.incorrectAnswers.includes(incorrectAnswer.toString())) {
    logger.warn('Attempted to store duplicate incorrect answer');
    return;
  }

  const changes = {
    ...puzzle,
    incorrectAnswers: [...puzzle.incorrectAnswers, incorrectAnswer.toString()],
  };

  await setPuzzles(addOrUpdatePuzzle(changes, puzzles));
};

/**
 * Checks to see if the answer has already been submitted to advent of code.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {String|Number} answer
 */
export const answerHasBeenSubmitted = async (year, day, part, answer) => {
  const puzzle = findPuzzle(puzzleId(year, day, part), await getPuzzles());

  if (!puzzle) {
    return false;
  }

  const answerToString = answer.toString();

  return (
    puzzle.correctAnswer === answerToString || puzzle.incorrectAnswers.includes(answerToString)
  );
};

/**
 * Returns the stored answer results for this puzzle.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @returns {Promise<String>} The stored correct answer, or null if doesn't exist.
 */
export const getCorrectAnswer = async (year, day, part) => (
  findPuzzle(puzzleId(year, day, part), await getPuzzles())?.correctAnswer || null
);

/**
 * Attempt to update the fastest execution time for this puzzle.
 * The fastest time will only be updated if the puzzle has a correct answer set
 * and the provided execution time is smaller than the current fastest time.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {Number} executionTimeNs
 */
export const tryToSetFastestExecutionTime = async (year, day, part, executionTimeNs) => {
  logger.debug('trying to set fastest execution time for year: %s, day: %s, part: %s', year, day, part);

  if (!Number.isFinite(executionTimeNs)) {
    throw new Error('Attempted to set fastest execution time to non numeric value');
  }

  const puzzles = await getPuzzles();
  const puzzle = findPuzzle(puzzleId(year, day, part), puzzles);

  // bail if puzzle has not been solved
  if (!puzzle?.correctAnswer) {
    logger.debug('not setting fastest execution time, puzzle has not been successfully answered.');
    return;
  }

  // bail if execution time was too slow
  if (puzzle.fastestExecutionTimeNs <= executionTimeNs) {
    logger.debug('not setting fastest execution time, execution time: %s was slower than stored fastest: %s', executionTimeNs, puzzle.fastestExecutionTimeNs);
    return;
  }

  logger.festive('That\'s your fastest execution time ever for this puzzle!');
  const changes = { ...puzzle, fastestExecutionTimeNs: executionTimeNs };
  await setPuzzles(addOrUpdatePuzzle(changes, puzzles));
};

/**
 * Returns the smallest unsolved puzzle for the given year.
 * If no puzzles have been solved that year, returns default of 1.
 * If all puzzles have been solved that year, returns null;
 * @param {Number} year
 */
export const getNextUnsolvedPuzzle = async (year) => {
  throw new Error('Not Implemented');
};
