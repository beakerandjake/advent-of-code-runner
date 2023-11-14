import { requiredLevelsHaveBeenSolved } from '../answers.js';
import { puzzleBaseUrl } from '../api/urls.js';
import { DirectoryNotInitializedError } from '../errors/cliErrors.js';
import {
  PuzzleInFutureError,
  PuzzleLevelInvalidError,
  PuzzleLevelNotMetError,
} from '../errors/puzzleErrors.js';
import { makeClickableLink } from '../formatting.js';
import { getPuzzleInput } from '../inputs/getPuzzleInput.js';
import { logger } from '../logger.js';
import { getYear } from '../persistence/metaRepository.js';
import { dataFileExists } from '../validation/userFilesExist.js';
import {
  puzzleHasLevel,
  puzzleIsInFuture,
} from '../validation/validatePuzzle.js';

/**
 * Attempts to execute the users solution for the puzzle.
 * @param {number} day
 * @param {number} level
 * @returns {Promise<string|int>} The value returned by the users code.
 */
const tryToSolvePuzzle = async (day, level) => {
  const year = await getYear();
  // ensure day/level combination is valid (day 25 only has one level)
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
};

/**
 * Solves the specific puzzle
 */
const solve = async (day, level) => {
  // bail if not initialized.
  if (!(await dataFileExists())) {
    throw new DirectoryNotInitializedError();
  }

  const solution = await tryToSolvePuzzle(day, level);
  console.log('solution', solution);
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
