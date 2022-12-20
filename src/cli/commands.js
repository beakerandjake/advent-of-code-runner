import { Command } from 'commander';
import { dayArgument, partArgument } from './arguments.js';
import { solvePuzzle, solvePuzzleAndSubmitAnswer, initialize } from '../actions/index.js';

/**
 * Command which lets the user solve a specific puzzle
 */
export const solveCommand = new Command()
  .name('solve')
  .description('Solve the puzzle, benchmark the execution time, and output the result.')
  .addArgument(dayArgument)
  .addArgument(partArgument)
  .action(solvePuzzle);

/**
 * Command which allows the user to submit a puzzles answer to advent of code.
 */
export const submitCommand = new Command()
  .name('submit')
  .description('Run the solution for the puzzle, then submit the result.')
  .addArgument(dayArgument)
  .addArgument(partArgument)
  .action(solvePuzzleAndSubmitAnswer);

/**
 * Command to initialize the users repository so it can run our cli.
 */
export const initializeCommand = new Command()
  .name('init')
  .description('Initialize a directory so advent-of-code-runner can run solutions.')
  .action(initialize);
