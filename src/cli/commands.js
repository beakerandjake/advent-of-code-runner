import { Command } from 'commander';
import { dayArgument, partArgument } from './arguments.js';
import { solve } from './actions/solve.js';

/**
 * Command which lets the user solve a specific puzzle
 */
export const solveCommand = new Command()
  .name('solve')
  .description('Solve the puzzle, benchmark the execution time, and output the result.')
  .addArgument(dayArgument)
  .addArgument(partArgument)
  .action(solve);
