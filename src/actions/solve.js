import { createChain } from './actionChain.js';
import {
  assertAnswerStillCorrect,
  assertPuzzleIsUnlocked,
  executeUserSolution,
  getAuthenticationToken,
  getPuzzleInput,
  getYear,
} from './links/index.js';

const actionChain = createChain([
  getYear,
  assertPuzzleIsUnlocked,
  getAuthenticationToken,
  getPuzzleInput,
  executeUserSolution,
  assertAnswerStillCorrect,
]);

/**
 * Downloads or loads the input to the puzzle, executes the users solution and outputs results.
 * @param {Number} day
 * @param {Number} part
 */
export const solve = (day, part) => actionChain({ day, part });
