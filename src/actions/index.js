import { assertAnswerCorrect } from './assertAnswerCorrect.js';
import { assertAnswerPreviouslySubmitted } from './assertAnswerPreviouslySubmitted.js';
import { assertInitialized } from './assertInitialized.js';
import { assertPuzzleLevelMet } from './assertPuzzleLevelMet.js';
import { assertPuzzleUnlocked } from './assertPuzzleUnlocked.js';
import { assertPuzzleUnsolved } from './assertPuzzleUnsolved.js';
import { assertReadmeExists } from './assertReadmeExists.js';
import { assertUserConfirmation } from './assertUserConfirmation.js';
import { executeUserSolution } from './executeUserSolution.js';
import { getAnswersFromUser } from './getAnswersFromUser.js';
import { getAuthenticationToken } from './getAuthenticationToken.js';
import { getNextUnsolvedPuzzle } from './getNextUnsolvedPuzzle.js';
import { getPuzzleInput } from './getPuzzleInput.js';
import { getYear } from './getYear.js';
import { and, not, or } from './logical.js';
import { outputCompletionTable } from './outputCompletionTable.js';
import { outputPuzzleLink } from './outputPuzzleLink.js';
import { storeFastestRuntime } from './storeFastestRuntime.js';
import { storeSubmittedAnswer } from './storeSubmittedAnswer.js';
import { submitPuzzleAnswer } from './submitPuzzleAnswer.js';
import { tryToUpdateFastestRuntime } from './tryToUpdateFastestRuntime.js';

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
  assertReadmeExists,
  assertUserConfirmation,
  executeUserSolution,
  getAnswersFromUser,
  getAuthenticationToken,
  getNextUnsolvedPuzzle,
  getPuzzleInput,
  getYear,
  storeFastestRuntime,
  storeSubmittedAnswer,
  submitPuzzleAnswer,
  tryToUpdateFastestRuntime,
  or,
  not,
  and,
  outputCompletionTable,
  outputPuzzleLink,
};
