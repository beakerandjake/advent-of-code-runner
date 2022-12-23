import { solveLinks } from './solve.js';
import { getNextUnsolvedPuzzle, getYear } from './links/index.js';
import { createChain } from './actionChain.js';

/**
 * We basically just need to run 'getNextUnsolvedPuzzle' at the start of the regular solve chain.
 * But to run 'getNextUnsolvedPuzzle' we need 'getYear', and the solve chain already has that.
 * It wouldn't be the end of the world to run 'getYear' twice, it's idempotent....
 * But there's no reason to if we don't have to, so just yank it off the front of the solve chain.
 * Add our required actions then concat the modified solve chain and we're golden.
 */
const actionChain = createChain([
  getYear,
  getNextUnsolvedPuzzle,
  ...solveLinks.filter((x) => x !== getYear),
]);

/**
 * Downloads or loads the input to the puzzle, executes the users solution and outputs results.
 * @param {Number} day
 * @param {Number} part
 */
export const autoSolve = () => actionChain({});
