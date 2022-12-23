import { createChain } from './actionChain.js';
import * as links from './links/index.js';

const actionChain = createChain([
  links.getYear,
  links.assertPuzzleIsUnlocked,
  links.assertPuzzleLevelMet,
  links.getAuthenticationToken,
  links.getPuzzleInput,
  links.executeUserSolution,
  links.submitPuzzleAnswer,
  links.storeSubmittedAnswer,
  links.assertAnswerIsCorrect,
  links.storeFastestExecutionTime,
]);

/**
 * Execute the users solution then submit their answer to advent of code
 * @param {Number} day
 * @param {Number} part
 */
export const submit = (day, part) => actionChain({ day, part });
