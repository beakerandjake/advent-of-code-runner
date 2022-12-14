import { createChain } from './actionChain.js';
import * as links from './links/index.js';

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
  links.not(links.assertAnswerPreviouslySubmitted),
  links.submitPuzzleAnswer,
  links.storeSubmittedAnswer,
  links.assertAnswerCorrect,
  links.storeFastestExecutionTime,
];

/**
 * "compile" the links into the submit action.
 */
const actionChain = createChain(submitLinks);

/**
 * Execute the users solution then submit their answer to advent of code
 * @param {Number} day
 * @param {Number} part
 */
export const submit = async (day, part) => actionChain({ day, part });
