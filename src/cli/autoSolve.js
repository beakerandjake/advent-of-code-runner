import { Command } from 'commander';
import { solveLinks } from './solve.js';
import { assertInitialized, getNextUnsolvedPuzzle, getYear } from '../actions/index.js';
import { createChain } from '../actions/actionChain.js';

/**
 * Append our links to the front of solves links, but be sure to remove duplicates.
 */
const actionChain = createChain([...new Set([
  ...[assertInitialized, getYear, getNextUnsolvedPuzzle],
  ...solveLinks,
])]);

/**
 * Downloads or loads the input to the puzzle, executes the users solution and outputs results.
 */
const autoSolve = async () => actionChain({});

/**
 * Command to solve the next unsolved puzzle.
 */
export const autoSolveCommand = new Command()
  .name('autosolve')
  .description('Find the next unsolved puzzle, execute it, benchmark the runtime and output the result.')
  .action(autoSolve);
