import { solveLinks } from './solve.js';
import { assertInitialized, getNextUnsolvedPuzzle, getYear } from './links/index.js';
import { createChain } from './actionChain.js';

/**
 * Append our links to the front of solves links, but be sure to remove duplicates.
 */
const actionChain = createChain([...new Set([
  ...[assertInitialized, getYear, getNextUnsolvedPuzzle],
  ...solveLinks,
])]);

/**
 * Downloads or loads the input to the puzzle, executes the users solution and outputs results.
 * @param {Number} day
 * @param {Number} part
 */
export const autoSolve = () => actionChain({});
