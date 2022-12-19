import { Command } from 'commander';
import { autoSolve } from './actions/autoSolve.js';

export const autoSolveCommand = new Command()
  .name('autosolve')
  .description('Solve the next unsolved puzzle, benchmarks the execution time, and outputs the result.')
  .action(autoSolve);
