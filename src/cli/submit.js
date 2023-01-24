import { Command } from 'commander';
import { createChain } from '../actions/actionChain.js';
import * as links from '../actions/index.js';
import { dayArgument, levelArgument } from './arguments.js';

/**
 * The links which together make up the submit action.
 */
export const submitLinks = [
  links.assertInitialized,
  links.getYear,
  links.outputPuzzleLink,
  links.assertPuzzleUnlocked,
  links.assertPuzzleLevelMet,
  links.assertPuzzleUnsolved,
  links.getAuthenticationToken,
  links.getPuzzleInput,
  links.executeUserSolution,
  links.assertAnswerNotPreviouslySubmitted,
  links.submitPuzzleAnswer,
  links.storeSubmittedAnswer,
  links.assertAnswerCorrect,
  links.storeFastestRuntime,
];

/**
 * "compile" the links into the submit action.
 */
const actionChain = createChain(submitLinks);

/**
 * Execute the users solution then submit their answer to advent of code
 * @param {Number} day
 * @param {Number} level
 */
const submit = async (day, level) => actionChain({ day, level });

/**
 * Command which allows the user to submit a puzzles answer to advent of code.
 */
export const submitCommand = new Command()
  .name('submit')
  .description('Run the solution for the puzzle, then submit the answer to advent of code.')
  .addArgument(dayArgument)
  .addArgument(levelArgument)
  .action(submit);
