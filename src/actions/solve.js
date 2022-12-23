import { createChain } from './actionChain.js';
import {
  assertAnswerStillCorrect,
  assertPuzzleIsUnlocked,
  assertPuzzleLevelMet,
  executeUserSolution,
  getAuthenticationToken,
  getPuzzleInput,
  getYear,
  tryToUpdateFastestExecutionTime,
} from './links/index.js';

const actionChain = createChain([
  getYear,
  assertPuzzleIsUnlocked,
  assertPuzzleLevelMet,
  getAuthenticationToken,
  getPuzzleInput,
  executeUserSolution,
  assertAnswerStillCorrect,
  tryToUpdateFastestExecutionTime,
]);

/**
 * Downloads or loads the input to the puzzle, executes the users solution and outputs results.
 * @param {Number} day
 * @param {Number} part
 */
export const solve = (day, part) => actionChain({ day, part });
