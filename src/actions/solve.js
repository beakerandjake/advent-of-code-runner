import { getYear } from './common/index.js';
import { createChain } from './actionChain.js';

const actionChain = createChain([
  getYear,
]);

/**
 * Downloads or loads the input to the puzzle, executes the users solution and outputs results.
 * @param {Number} day
 * @param {Number} part
 */
export const solve = (day, part) => actionChain({ day, part });
