import { assertAnswerCorrect } from './assertAnswerCorrect.js';
import { assertAnswerPreviouslySubmitted } from './assertAnswerPreviouslySubmitted.js';
import { assertInitialized } from './assertInitialized.js';
import { assertPuzzleUnlocked } from './assertPuzzleUnlocked.js';
import { assertPuzzleUnsolved } from './assertPuzzleUnsolved.js';
import { assertPuzzleLevelMet } from './assertPuzzleLevelMet.js';
import { assertUserConfirmation } from './assertUserConfirmation.js';
import { executeUserSolution } from './executeUserSolution.js';
import { getAuthenticationToken } from './getAuthenticationToken.js';
import { getNextUnsolvedPuzzle } from './getNextUnsolvedPuzzle.js';
import { getPuzzleInput } from './getPuzzleInput.js';
import { getYear } from './getYear.js';
import { or, not } from './logical.js';
import { storeFastestExecutionTime } from './storeFastestExecutionTime.js';
import { storeSubmittedAnswer } from './storeSubmittedAnswer.js';
import { submitPuzzleAnswer } from './submitPuzzleAnswer.js';
import { tryToUpdateFastestExecutionTime } from './tryToUpdateFastestExecutionTime.js';

/**
 * barrel for "link" functions which are used to compose action chains.
 */

export {
  assertAnswerCorrect,
  assertAnswerPreviouslySubmitted,
  assertInitialized,
  assertPuzzleUnlocked,
  assertPuzzleUnsolved,
  assertPuzzleLevelMet,
  assertUserConfirmation,
  executeUserSolution,
  getAuthenticationToken,
  getNextUnsolvedPuzzle,
  getPuzzleInput,
  getYear,
  storeFastestExecutionTime,
  storeSubmittedAnswer,
  submitPuzzleAnswer,
  tryToUpdateFastestExecutionTime,
  or,
  not,
};
