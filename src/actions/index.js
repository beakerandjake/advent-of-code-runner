import { assertAnswerCorrect } from './assertAnswerCorrect.js';
import { assertAnswerNotPreviouslySubmitted } from './assertAnswerNotPreviouslySubmitted.js';
import { assertInitialized } from './assertInitialized.js';
import { assertPuzzleLevelMet } from './assertPuzzleLevelMet.js';
import { assertPuzzleUnlocked } from './assertPuzzleUnlocked.js';
import { assertPuzzleUnsolved } from './assertPuzzleUnsolved.js';
import { assertUserConfirmation } from './assertUserConfirmation.js';
import { executeUserSolution } from './executeUserSolution.js';
import { getAnswersFromUser } from './getAnswersFromUser.js';
import { getAuthenticationToken } from './getAuthenticationToken.js';
import { getNextUnsolvedPuzzle } from './getNextUnsolvedPuzzle.js';
import { getPuzzleInput } from './getPuzzleInput.js';
import { getYear } from './getYear.js';
import {
  and, not, or, passThrough,
} from './logical.js';
import { outputCompletionTable } from './outputCompletionTable.js';
import { outputPuzzleLink } from './outputPuzzleLink.js';
import { saveProgressTableToReadme } from './saveProgressTableToReadme.js';
import { storeFastestRuntime } from './storeFastestRuntime.js';
import { storeSubmittedAnswer } from './storeSubmittedAnswer.js';
import { submitPuzzleAnswer } from './submitPuzzleAnswer.js';
import { tryToUpdateFastestRuntime } from './tryToUpdateFastestRuntime.js';

/**
 * barrel for "link" functions which are used to compose action chains.
 */

export {
  and,
  assertAnswerCorrect,
  assertAnswerNotPreviouslySubmitted,
  assertInitialized,
  assertPuzzleUnlocked,
  assertPuzzleUnsolved,
  assertPuzzleLevelMet,
  assertUserConfirmation,
  executeUserSolution,
  getAnswersFromUser,
  getAuthenticationToken,
  getNextUnsolvedPuzzle,
  getPuzzleInput,
  getYear,
  not,
  or,
  outputCompletionTable,
  outputPuzzleLink,
  passThrough,
  saveProgressTableToReadme,
  storeFastestRuntime,
  storeSubmittedAnswer,
  submitPuzzleAnswer,
  tryToUpdateFastestRuntime,
};
