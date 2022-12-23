import { createChain } from './actionChain.js';
import {
  assertPuzzleIsUnlocked,
  assertPuzzleLevelMet,
  executeUserSolution,
  getAuthenticationToken,
  getPuzzleInput,
  getYear,
} from './links/index.js';

const actionChain = createChain([
  getYear,
  assertPuzzleIsUnlocked,
  assertPuzzleLevelMet,
  getAuthenticationToken,
  getPuzzleInput,
  executeUserSolution,
]);

/**
 * Execute the users solution then submit their answer to advent of code
 * @param {Number} day
 * @param {Number} part
 */
export const submit = (day, part) => actionChain({ day, part });
