import { Command } from 'commander';
import {
  autoSubmit,
  submit,
} from '../actions/index.js';
import { dayArgument, partArgument } from './arguments.js';

/**
 * Command which allows the user to submit a puzzles answer to advent of code.
 */
export const submitCommand = new Command()
  .name('submit')
  .description('Run the solution for the puzzle, then submit the answer to advent of code.')
  .addArgument(dayArgument)
  .addArgument(partArgument)
  .action(submit);

/**
 * Command to submit the next unsolved puzzle.
 */
export const autoSubmitCommand = new Command()
  .name('autosubmit')
  .description('Find the next unsolved puzzle, execute it, then submit the answer to advent of code.')
  .action(autoSubmit);
