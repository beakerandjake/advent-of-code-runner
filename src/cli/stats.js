import { Command } from 'commander';
import { createChain } from '../actions/actionChain.js';
import { assertInitialized, getYear, outputCompletionTable } from '../actions/index.js';

/**
 * "compile" the links into the stats action.
 */
const actionChain = createChain([
  assertInitialized,
  getYear,
  outputCompletionTable,
]);

/**
 * Outputs stats about user progress.
 */
const stats = async () => actionChain();

/**
 * Command to output user statistics.
 */
export const statsCommand = new Command()
  .name('stats')
  .description('Output your completion progress for the years advent of code.')
  .action(stats);
