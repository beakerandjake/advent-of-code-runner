import { Command } from 'commander';
import { createChain } from '../actions/actionChain.js';
import * as actions from '../actions/index.js';
import { dayArgument, levelArgument } from './arguments.js';

/**
 * The common actions between the 'solve' and 'autosolve' commands
 */
const solveActions = [
  actions.outputPuzzleLink,
  actions.assertPuzzleUnlocked,
  actions.assertPuzzleLevelMet,
  actions.getPuzzleInput,
  actions.executeUserSolution,
  actions.assertAnswerCorrect,
  actions.tryToUpdateFastestRuntime,
  actions.tryToUpdateReadmeWithProgressTable,
];

/**
 * Solves a specific puzzle.
 */
const solve = createChain([
  actions.assertInitialized,
  actions.getYear,
  ...solveActions,
]);

/**
 * Finds the next unsolved puzzle and then solves it.
 */
const autoSolve = createChain([
  actions.assertInitialized,
  actions.getYear,
  actions.getNextUnsolvedPuzzle,
  ...solveActions,
]);

/**
 * Command which lets the user solve a puzzle
 */
export const solveCommand = new Command()
  .name('solve')
  .description(
    'Runs your solution for a puzzle, measures the runtime, and outputs the answer.'
  )
  .addHelpText(
    'after',
    `
Example Calls:
  solve               (Finds and solves your next unsolved puzzle)
  solve [day]         (Solves level one of the specified days puzzle)
  solve [day] [level] (Solves the puzzle for the specified day and level)
  `
  )
  .addArgument(dayArgument)
  .addArgument(levelArgument)
  .action(async (day, level) => {
    if (day == null && level == null) {
      await autoSolve({});
    } else if (day != null && level == null) {
      await solve({ day, level: 1 });
    } else {
      await solve({ day, level });
    }
  });
