import { Command } from 'commander';
import { createChain } from '../actions/actionChain.js';
import {
  assertInitialized,
  assertReadmeExists,
  getNextUnsolvedPuzzle,
  getYear,
  saveCompletionTableToReadme,
} from '../actions/index.js';
import { submitLinks } from './submit.js';

/**
 * Append our links to the front of submits links, but be sure to remove duplicates.
 */
const actionChain = createChain([...new Set([
  ...[assertInitialized, getYear, getNextUnsolvedPuzzle],
  ...submitLinks,
  assertReadmeExists,
  saveCompletionTableToReadme,
])]);

/**
 * Downloads or loads the input to the puzzle, executes the users solution and outputs results.
 */
const autoSubmit = async () => actionChain({});

/**
 * Command to submit the next unsolved puzzle.
 */
export const autoSubmitCommand = new Command()
  .name('autosubmit')
  .description('Find the next unsolved puzzle, execute it, then submit the answer to advent of code.')
  .action(autoSubmit);
