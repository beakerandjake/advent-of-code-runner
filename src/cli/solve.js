import { Command } from 'commander';
import { createChain } from '../actions/actionChain.js';
import * as links from '../actions/index.js';
import { dayArgument, partArgument } from './arguments.js';

/**
 * The links which together make up the solve action.
 */
export const solveLinks = [
  links.assertInitialized,
  links.getYear,
  links.outputPuzzleLink,
  links.assertPuzzleUnlocked,
  links.assertPuzzleLevelMet,
  links.getPuzzleInput,
  links.executeUserSolution,
  links.assertAnswerCorrect,
  links.tryToUpdateFastestExecutionTime,
];

/**
 * "compile" the links into the solve action.
 */
const actionChain = createChain(solveLinks);

/**
 * Downloads or loads the input to the puzzle, executes the users solution and outputs results.
 * @param {Number} day
 * @param {Number} part
 */
const solve = async (day, part) => actionChain({ day, part });

/**
 * Command which lets the user solve a specific puzzle
 */
export const solveCommand = new Command()
  .name('solve')
  .description('Solve the puzzle, benchmark the execution time, and output the result.')
  .addArgument(dayArgument)
  .addArgument(partArgument)
  .action(solve);