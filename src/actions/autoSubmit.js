import { submitLinks } from './submit.js';
import { assertInitialized, getNextUnsolvedPuzzle, getYear } from './links/index.js';
import { createChain } from './actionChain.js';

/**
 * Append our links to the front of submits links, but be sure to remove duplicates.
 */
const actionChain = createChain([...new Set([
  ...[assertInitialized, getYear, getNextUnsolvedPuzzle],
  ...submitLinks,
])]);

/**
 * Downloads or loads the input to the puzzle, executes the users solution and outputs results.
 * @param {Number} day
 * @param {Number} part
 */
export const autoSubmit = async () => actionChain({});
