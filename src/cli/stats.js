import { createChain } from '../actions/actionChain.js';
import {
  assertInitialized,
  generateCliProgressTable,
  generateMarkdownProgressTable,
  getCompletionData,
  getYear,
  printProgressTable,
  saveProgressTableToReadme,
} from '../actions/index.js';

/**
 * Output stats to the cli
 */
const outputStats = createChain([
  assertInitialized,
  getYear,
  getCompletionData,
  generateCliProgressTable,
  printProgressTable,
]);

/**
 * Save the stats to the users readme file
 */
const saveStats = createChain([
  assertInitialized,
  getYear,
  getCompletionData,
  generateMarkdownProgressTable,
  saveProgressTableToReadme,
]);

/**
 * The action that is invoked by commander.
 * @private
 */
export const statsAction = async ({ save } = {}) => {
  if (save) {
    await saveStats();
  } else {
    await outputStats();
  }
};
