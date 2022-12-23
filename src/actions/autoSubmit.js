import { submitLinks } from './submit.js';
import { getNextUnsolvedPuzzle, getYear } from './links/index.js';
import { createChain } from './actionChain.js';

/**
 * Same as autoSolve, replace the submit chains 'getYear' with our additional link.
 */
const actionChain = createChain([
  getYear,
  getNextUnsolvedPuzzle,
  ...submitLinks.filter((x) => x !== getYear),
]);

/**
 * Downloads or loads the input to the puzzle, executes the users solution and outputs results.
 * @param {Number} day
 * @param {Number} part
 */
export const autoSubmit = () => actionChain({});
