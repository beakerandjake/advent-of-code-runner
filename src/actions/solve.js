import { createChain } from './actionChain.js';
import * as links from './links/index.js';

/**
 * The links which together make up the solve action.
 */
export const solveLinks = [
  links.assertInitialized,
  links.getYear,
  links.assertPuzzleUnlocked,
  links.assertPuzzleLevelMet,
  links.getAuthenticationToken,
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
export const solve = async (day, part) => actionChain({ day, part });
