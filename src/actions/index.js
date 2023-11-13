import { assertAnswerCorrect } from './assertAnswerCorrect.js';
import { assertAnswerNotPreviouslySubmitted } from './assertAnswerNotPreviouslySubmitted.js';
import { assertConfigValue } from './assertConfigValue.js';
import { assertInitialized } from './assertInitialized.js';
import { assertPuzzleHasLevel } from './assertPuzzleHasLevel.js';
import { assertPuzzleLevelMet } from './assertPuzzleLevelMet.js';
import { assertPuzzleUnlocked } from './assertPuzzleUnlocked.js';
import { assertPuzzleUnsolved } from './assertPuzzleUnsolved.js';
import { assertUserConfirmation } from './assertUserConfirmation.js';
import { executeUserSolution } from './executeUserSolution.js';
import { generateCliProgressTable } from './generateCliProgressTable.js';
import { generateMarkdownProgressTable } from './generateMarkdownProgressTable.js';
import { getAnswersFromUser } from './getAnswersFromUser.js';
import { getAuthenticationToken } from './getAuthenticationToken.js';
import { getCompletionData } from './getCompletionData.js';
import { getNextUnsolvedPuzzle } from './getNextUnsolvedPuzzle.js';
import { getPuzzleInput } from './getPuzzleInput.js';
import { getYear } from './getYear.js';
import { and, not, or, ifThen } from './logical.js';
import { printProgressTable } from './printProgressTable.js';
import { outputPuzzleLink } from './outputPuzzleLink.js';
import { saveProgressTableToReadme } from './saveProgressTableToReadme.js';
import { storeFastestRuntime } from './storeFastestRuntime.js';
import { storeSubmittedAnswer } from './storeSubmittedAnswer.js';
import { submitPuzzleAnswer } from './submitPuzzleAnswer.js';
import { tryToUpdateFastestRuntime } from './tryToUpdateFastestRuntime.js';
import { tryToUpdateReadmeWithProgressTable } from './tryToUpdateReadmeWithProgressTable.js';

/**
 * barrel for "link" functions which are used to compose action chains.
 */

export {
  and,
  assertAnswerCorrect,
  assertAnswerNotPreviouslySubmitted,
  assertConfigValue,
  assertInitialized,
  assertPuzzleUnlocked,
  assertPuzzleUnsolved,
  assertPuzzleHasLevel,
  assertPuzzleLevelMet,
  assertUserConfirmation,
  executeUserSolution,
  generateMarkdownProgressTable,
  getAnswersFromUser,
  getAuthenticationToken,
  getCompletionData,
  getNextUnsolvedPuzzle,
  getPuzzleInput,
  getYear,
  not,
  or,
  ifThen,
  printProgressTable,
  outputPuzzleLink,
  saveProgressTableToReadme,
  storeFastestRuntime,
  storeSubmittedAnswer,
  submitPuzzleAnswer,
  tryToUpdateFastestRuntime,
  tryToUpdateReadmeWithProgressTable,
  generateCliProgressTable,
};
