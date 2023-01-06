import { createChain } from './actionChain.js';
import { assertInitialized, getYear, outputCompletionTable } from './links/index.js';

/**
 * The links which together make up the stats action.
 */
export const statsLinks = [
  assertInitialized,
  getYear,
  outputCompletionTable,
];

/**
 * "compile" the links into the solve action.
 */
const actionChain = createChain(statsLinks);

/**
 * Outputs the
 * @param {Number} day
 * @param {Number} part
 */
export const stats = async () => actionChain();
