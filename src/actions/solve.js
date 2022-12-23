import { createChain } from './actionChain.js';
import {
  assertAnswerIsCorrect,
  assertPuzzleIsUnlocked,
  assertPuzzleLevelMet,
  executeUserSolution,
  getAuthenticationToken,
  getPuzzleInput,
  getYear,
  tryToUpdateFastestExecutionTime,
} from './links/index.js';

/**
 * The links which together make up the solve action.
 */
export const solveLinks = [
  getYear,
  assertPuzzleIsUnlocked,
  assertPuzzleLevelMet,
  getAuthenticationToken,
  getPuzzleInput,
  executeUserSolution,
  assertAnswerIsCorrect,
  tryToUpdateFastestExecutionTime,
];

/**
 * "compile" the links into the solve action.
 */
const actionChain = createChain(solveLinks);

/**
 * Downloads or loads the input to the puzzle, executes the users solution and outputs results.
 * @param {Number} day
 * @param {Number} part
 */
export const solve = (day, part) => actionChain({ day, part });
