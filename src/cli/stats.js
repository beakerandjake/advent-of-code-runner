import { Command } from 'commander';
import { createChain } from '../actions/actionChain.js';
import {
  assertConfigValue,
  assertInitialized,
  generateMarkdownProgressTable,
  getCompletionData,
  getYear,
  outputCompletionTable,
  saveProgressTableToReadme,
  not,
} from '../actions/index.js';

/**
 * Updates the users README with the progress table unless feature is disabled in config.
 */
export const tryToSaveProgressTableToReadme = async (args) => {
  const action = createChain([
    // halt the chain if the auto save feature is disabled
    not(assertConfigValue('disableReadmeAutoSaveProgress')),
    getCompletionData,
    generateMarkdownProgressTable,
    saveProgressTableToReadme,
  ]);

  // "swallow" the return value of the chain, that way the parent
  // chain this is being invoked in can continue whether or not
  // our sub chain succeeds. (exceptions will still be bubbled however)
  await action({ ...args });
};

/**
 * Output stats to the cli
 */
const outputStats = createChain([
  assertInitialized,
  getYear,
  outputCompletionTable,
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
 * Command to output user statistics.
 */
export const statsCommand = new Command()
  .name('stats')
  .description('Output your completion progress for the years advent of code.')
  .option('--save', 'Save your completion progress to the README file')
  .action(async ({ save }) => {
    if (save) {
      await saveStats({ forceSaveProgressToReadme: true });
    } else {
      await outputStats();
    }
  });
