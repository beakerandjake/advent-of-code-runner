import { Command } from 'commander';
import {
  autoSolve,
  autoSubmit,
  initialize,
  solve,
  stats,
  submit,
} from '../actions/index.js';
import { dayArgument, partArgument } from './arguments.js';

/**
 * Command which lets the user solve a specific puzzle
 */
export const solveCommand = new Command()
  .name('solve')
  .description('Solve the puzzle, benchmark the execution time, and output the result.')
  .addArgument(dayArgument)
  .addArgument(partArgument)
  .action(solve);

/**
 * Command to solve the next unsolved puzzle.
 */
export const autoSolveCommand = new Command()
  .name('autosolve')
  .description('Find the next unsolved puzzle, execute it, benchmark the execution time and output the result.')
  .action(autoSolve);

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

/**
 * Command to initialize the users repository so it can run our cli.
 */
export const initializeCommand = new Command()
  .name('init')
  .description('Initialize a directory so advent-of-code-runner can run solutions.')
  .action(initialize);

/**
 * Command to output user statistics.
 */
export const statsCommand = new Command()
  .name('stats')
  .description('Output your completion progress for the years advent-of-code.')
  .action(stats);
