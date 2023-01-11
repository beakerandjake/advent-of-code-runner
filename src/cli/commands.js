import { Command } from 'commander';
import {
  autoSubmit,
} from '../actions/index.js';
/**
 * Command to submit the next unsolved puzzle.
 */
export const autoSubmitCommand = new Command()
  .name('autosubmit')
  .description('Find the next unsolved puzzle, execute it, then submit the answer to advent of code.')
  .action(autoSubmit);
