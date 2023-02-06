import { Command } from 'commander';
import { createChain } from '../actions/actionChain.js';
import * as actions from '../actions/index.js';
import { dayArgument, levelArgument } from './arguments.js';

/**
 * The common actions between the 'submit' and 'autosubmit' commands
 */
const submitActions = [
  actions.outputPuzzleLink,
  actions.assertPuzzleUnlocked,
  actions.assertPuzzleLevelMet,
  actions.assertPuzzleUnsolved,
  actions.getAuthenticationToken,
  actions.getPuzzleInput,
  actions.executeUserSolution,
  actions.assertAnswerNotPreviouslySubmitted,
  actions.submitPuzzleAnswer,
  actions.storeSubmittedAnswer,
  actions.ifThen(actions.assertAnswerCorrect, actions.storeFastestRuntime),
  actions.tryToUpdateReadmeWithProgressTable,
];

/**
 * Submit a specific puzzle.
 */
const submit = createChain([
  actions.assertInitialized,
  actions.getYear,
  ...submitActions,
]);

/**
 * Finds the next unsolved puzzle and then submits it.
 */
const autoSubmit = createChain([
  actions.assertInitialized,
  actions.getYear,
  actions.getNextUnsolvedPuzzle,
  ...submitActions,
]);

/**
 * Command which allows the user to submit a puzzles answer to advent of code.
 */
export const submitCommand = new Command()
  .name('submit')
  .description(
    'Runs your solution for a puzzle and submits the answer to advent of code.`'
  )
  .addHelpText(
    'after',
    `
Example Calls:
  submit               (Finds and submits your next unsolved puzzle)
  submit [day]         (Submits level one of the specified days puzzle)
  submit [day] [level] (Submits the puzzle for the specified day and level)
    `
  )
  .addArgument(dayArgument)
  .addArgument(levelArgument)
  .action(async (day, level) => {
    if (day == null && level == null) {
      await autoSubmit({});
    } else if (day != null && level == null) {
      await submit({ day, level: 1 });
    } else {
      await submit({ day, level });
    }
  });
