import { assertAnswerStillCorrect } from './assertAnswerStillCorrect.js';
import { assertPuzzleIsUnlocked } from './assertPuzzleIsUnlocked.js';
import { executeUserSolution } from './executeUserSolution.js';
import { getAuthenticationToken } from './getAuthenticationToken.js';
import { getPuzzleInput } from './getPuzzleInput.js';
import { getYear } from './getYear.js';
import { tryToUpdateFastestExecutionTime } from './tryToUpdateFastestExecutionTime.js';

/**
 * barrel for "link" functions which are used to compose action chains.
 */

export {
  assertAnswerStillCorrect,
  assertPuzzleIsUnlocked,
  executeUserSolution,
  getAuthenticationToken,
  getPuzzleInput,
  getYear,
  tryToUpdateFastestExecutionTime,
};
