import { createChain } from './actionChain.js';
import {
  assertPuzzleIsUnlocked,
  executeUserSolution,
  getAuthenticationToken,
  getPuzzleInput,
  getYear,
} from './common/index.js';

const actionChain = createChain([
  getYear,
  assertPuzzleIsUnlocked,
  getAuthenticationToken,
  getPuzzleInput,
  executeUserSolution,
]);

/**
 * Downloads or loads the input to the puzzle, executes the users solution and outputs results.
 * @param {Number} day
 * @param {Number} part
 */
export const solve = (day, part) => actionChain({ day, part });
