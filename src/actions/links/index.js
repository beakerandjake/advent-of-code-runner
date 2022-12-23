import { assertAnswerIsCorrect } from './assertAnswerIsCorrect.js';
import { assertAnswerNotPreviouslySubmitted } from './assertAnswerNotPreviouslySubmitted.js';
import { assertPuzzleIsUnlocked } from './assertPuzzleIsUnlocked.js';
import { assertPuzzleIsUnsolved } from './assertPuzzleIsUnsolved.js';
import { assertPuzzleLevelMet } from './assertPuzzleLevelMet.js';
import { executeUserSolution } from './executeUserSolution.js';
import { getAuthenticationToken } from './getAuthenticationToken.js';
import { getPuzzleInput } from './getPuzzleInput.js';
import { getYear } from './getYear.js';
import { storeFastestExecutionTime } from './storeFastestExecutionTime.js';
import { storeSubmittedAnswer } from './storeSubmittedAnswer.js';
import { submitPuzzleAnswer } from './submitPuzzleAnswer.js';
import { tryToUpdateFastestExecutionTime } from './tryToUpdateFastestExecutionTime.js';

/**
 * barrel for "link" functions which are used to compose action chains.
 */

export {
  assertAnswerIsCorrect,
  assertAnswerNotPreviouslySubmitted,
  assertPuzzleIsUnlocked,
  assertPuzzleIsUnsolved,
  assertPuzzleLevelMet,
  executeUserSolution,
  getAuthenticationToken,
  getPuzzleInput,
  getYear,
  storeFastestExecutionTime,
  storeSubmittedAnswer,
  submitPuzzleAnswer,
  tryToUpdateFastestExecutionTime,
};
