import { Command } from 'commander';
import { createChain } from '../actions/actionChain.js';
import {
  assertInitialized,
  getYear,
  outputCompletionTable,
  assertReadmeExists,
} from '../actions/index.js';

/**
 * Output stats to the cli
 */
const outputStats = createChain([
  assertInitialized,
  getYear,
  outputCompletionTable,
]);

/**
 * Save the stats to the users readme file
 */
const saveStats = createChain([
  assertInitialized,
  assertReadmeExists,
]);

/**
 * Command to output user statistics.
 */
export const statsCommand = new Command()
  .name('stats')
  .description('Output your completion progress for the years advent of code.')
  .option('--save', 'Save your completion progress to the README file')
  .action(async ({ save }) => {
    if (save) {
      await saveStats();
    } else {
      await outputStats();
    }
  });
