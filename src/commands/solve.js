import {
  answersEqual,
  getCorrectAnswer,
  requiredLevelsHaveBeenSolved,
} from '../answers.js';
import { puzzleBaseUrl } from '../api/urls.js';
import { getConfigValue } from '../config.js';
import { DirectoryNotInitializedError } from '../errors/cliErrors.js';
import {
  PuzzleInFutureError,
  PuzzleLevelInvalidError,
  PuzzleLevelNotMetError,
} from '../errors/puzzleErrors.js';
import { humanizeDuration, makeClickableLink } from '../formatting.js';
import { getPuzzleInput } from '../inputs/getPuzzleInput.js';
import { logger } from '../logger.js';
import { getYear } from '../persistence/metaRepository.js';
import { execute } from '../solutions/solutionRunner.js';
import {
  getPuzzlesFastestRuntime,
  setPuzzlesFastestRuntime,
} from '../statistics.js';
import { dataFileExists } from '../validation/userFilesExist.js';
import {
  puzzleHasLevel,
  puzzleIsInFuture,
} from '../validation/validatePuzzle.js';

/**
 * Execute the users solution file for the puzzle and return the result.
 */
const executeUserSolution = async (day, level, input) => {
  logger.festive('Executing your code');

  // output a pending message to user if their code is taking a while.
  const timeout = setTimeout(() => {
    logger.festive('Your code is still running, press Ctrl+C to cancel...');
  }, getConfigValue('solutionRunner.cancelMessageDelayMs'));

  const { answer, runtimeNs } = await execute(day, level, input);

  clearTimeout(timeout);

  logger.festive(
    'You answered: %s (solved in %s)',
    answer,
    humanizeDuration(runtimeNs)
  );

  return { answer, runtimeNs };
};

/**
 * Attempts to execute the users solution for the puzzle.
 * @param {number} day
 * @param {number} level
 */
export const tryToSolvePuzzle = async (year, day, level) => {
  if (!puzzleHasLevel(year, day, level)) {
    throw new PuzzleLevelInvalidError(day, level);
  }
  if (puzzleIsInFuture(year, day)) {
    throw new PuzzleInFutureError(day);
  }
  if (!(await requiredLevelsHaveBeenSolved(year, day, level))) {
    throw new PuzzleLevelNotMetError(day, level);
  }

  // log puzzle url to console.
  const clickable = makeClickableLink('Puzzle', puzzleBaseUrl(year, day));
  logger.festive(`${clickable} (Year: ${year} Day: ${day} Level: ${level})`);

  // load the puzzle input.
  logger.festive('Loading puzzle input.');
  const input = await getPuzzleInput(year, day, level);

  // run the users code and return the result.
  return executeUserSolution(day, level, input);
};

/**
 * Checks if the answer matches the previously submitted answer.
 * Always returns false if the puzzle has not been solved.
 */
const answerIsCorrect = async (year, day, level, answer) => {
  const correctAnswer = await getCorrectAnswer(year, day, level);
  if (correctAnswer && !answersEqual(answer, correctAnswer)) {
    // if new answer doesn't match correct answer
    // warn user that something might have broken.
    logger.warn(
      'Puzzle previously submitted, but answer: "%s" doesn\'t match correct answer: "%s"',
      answer,
      correctAnswer
    );
    return false;
  }
  return !!correctAnswer;
};

/**
 * Compares the puzzles latest runtime to the fastest stored runtime.
 * If the latest time is faster that the stored, the new value will be stored.
 */
const tryToUpdateFastestRuntime = async (year, day, level, runtimeNs) => {
  if (runtimeNs < 0) {
    throw new RangeError('runtime cannot be negative');
  }
  const fastestRuntime = await getPuzzlesFastestRuntime(year, day, level);
  if (fastestRuntime && runtimeNs >= fastestRuntime) {
    logger.verbose(
      'not updating fastest runtime, %s is <= to record: %s',
      runtimeNs,
      fastestRuntime
    );
  } else {
    logger.festive("That's your fastest runtime ever for this puzzle!");
    await setPuzzlesFastestRuntime(year, day, level, runtimeNs);
  }
};

/**
 * Solves the specific puzzle
 */
const solve = async (day, level) => {
  // bail if not initialized.
  if (!(await dataFileExists())) {
    throw new DirectoryNotInitializedError();
  }
  const year = await getYear();
  const { answer, runtimeNs } = await tryToSolvePuzzle(year, day, level);
  if (await answerIsCorrect(year, day, level, answer)) {
    await tryToUpdateFastestRuntime(year, day, level, runtimeNs);
  }
};

/**
 * Solves the next unsolved puzzle based on users progress.
 */
const autoSolve = async () => {};

/**
 * Command to execute the users solution for a specific puzzle.
 * @param {number} day
 * @param {number} level
 */
export const solveAction = async (day, level) => {
  if (!day && !level) {
    await autoSolve();
  } else if (day && !level) {
    await solve(day, 1);
  } else {
    await solve(day, level);
  }
};

// /**
//  * The common actions between the 'solve' and 'autosolve' commands
//  */
// const solveActions = [
//   actions.assertPuzzleHasLevel,
//   actions.outputPuzzleLink,
//   actions.assertPuzzleUnlocked,
//   actions.assertPuzzleLevelMet,
//   actions.getPuzzleInput,
//   actions.executeUserSolution,
//   actions.assertAnswerCorrect,
//   actions.tryToUpdateFastestRuntime,
//   actions.tryToUpdateReadmeWithProgressTable,
// ];

// /**
//  * Solves a specific puzzle.
//  */
// // prettier-ignore
// const solve = createChain([
//   actions.assertInitialized,
//   actions.getYear,
//   ...solveActions,
// ]);

// /**
//  * Finds the next unsolved puzzle and then solves it.
//  */
// const autoSolve = createChain([
//   actions.assertInitialized,
//   actions.getYear,
//   actions.getNextUnsolvedPuzzle,
//   ...solveActions,
// ]);

// /**
//  * The action that is invoked by commander.
//  * @private
//  */
// export const solveAction = async (day, level) => {
//   if (day == null && level == null) {
//     await autoSolve({});
//   } else if (day != null && level == null) {
//     await solve({ day, level: 1 });
//   } else {
//     await solve({ day, level });
//   }
// };
