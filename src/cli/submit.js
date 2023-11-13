import { createChain } from '../actions/actionChain.js';
import * as actions from '../actions/index.js';

/**
 * The common actions between the 'submit' and 'autosubmit' commands
 */
const submitActions = [
  actions.assertPuzzleHasLevel,
  actions.outputPuzzleLink,
  actions.assertPuzzleUnlocked,
  actions.assertPuzzleLevelMet,
  actions.assertPuzzleUnsolved,
  actions.getAuthenticationToken,
  actions.getPuzzleInput,
  actions.executeUserSolution,
  actions.assertAnswerNotPreviouslySubmitted,
  actions.submitPuzzleAnswer,
  actions.storeSubmittedAnswer,
  actions.ifThen(actions.assertAnswerCorrect, actions.storeFastestRuntime),
  actions.tryToUpdateReadmeWithProgressTable,
];

/**
 * Submit a specific puzzle.
 */
const submit = createChain([
  actions.assertInitialized,
  actions.getYear,
  ...submitActions,
]);

/**
 * Finds the next unsolved puzzle and then submits it.
 */
const autoSubmit = createChain([
  actions.assertInitialized,
  actions.getYear,
  actions.getNextUnsolvedPuzzle,
  ...submitActions,
]);

/**
 * The action that is invoked by commander.
 * @private
 */
export const submitAction = async (day, level) => {
  if (day == null && level == null) {
    await autoSubmit({});
  } else if (day != null && level == null) {
    await submit({ day, level: 1 });
  } else {
    await submit({ day, level });
  }
};
