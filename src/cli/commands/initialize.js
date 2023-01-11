import { Command } from 'commander';
import { createChainWithReporting } from '../../actions/actionChainWithProgress.js';
import { assertUserConfirmation, getAnswersFromUser } from '../../actions/links/index.js';
import { getConfigValue } from '../../config.js';
import { festiveEmoji, festiveStyle, printFestiveTitle } from '../../festive.js';
import {
  createDataFile,
  createDotEnv,
  createGitIgnore,
  createPackageJson,
  createReadme,
  createSolutionFiles,
  cwdIsEmpty,
  deleteExistingInputFiles,
  installPackages,
} from '../../initialize/index.js';

/**
 * inquirer.js question which makes the user confirm the initialize operation.
 */
const confirmInitializeQuestion = {
  type: 'confirm',
  name: 'confirmed',
  message: festiveStyle(
    'This directory is not empty! This operation will overwrite files, do you want to continue?',
  ),
  default: false,
  prefix: festiveEmoji(),
};

/**
 * Array of inquirer questions which will be asked in order.
 * The answers will provide us all of the information we need to initialize.
 */
const initializeQuestions = [
  {
    // in future if list of years becomes too large the change to raw input.
    type: 'list',
    name: 'year',
    message: festiveStyle('What year of advent of code are you doing?'),
    prefix: festiveEmoji(),
    choices: getConfigValue('aoc.validation.years').reverse(),
    loop: false,
  },
  {
    // in future if list of years becomes too large the change to raw input.
    type: 'password',
    name: 'authToken',
    message: festiveStyle('Enter your advent of code authentication token'),
    prefix: festiveEmoji(),
    choices: getConfigValue('aoc.validation.years'),
    loop: false,
    validate: (input) => (input ? true : 'Token cannot be empty!'),
    filter: (input) => input.trim(),
  },
];

/**
 * A Link which creates all required files in the cwd.
 */
const createFiles = async ({ answers }) => {
  await Promise.all([
    deleteExistingInputFiles(),
    createDataFile(answers),
    createDotEnv(answers),
    createGitIgnore(answers),
    createPackageJson(answers),
    createReadme(answers),
    createSolutionFiles(answers),
  ]);
};

/**
 * Scaffolds the cwd with all files required to use this cli.
 */
const initialize = async () => {
  // if there are files in the cwd, get confirmation with the user that they want to proceed.
  if (!await cwdIsEmpty() && !await assertUserConfirmation(confirmInitializeQuestion)()) {
    return;
  }

  // get all the info we need in order to initialize.
  const { answers } = await getAnswersFromUser(initializeQuestions)();

  // run initialize steps in an action chain that reports its progress to the user.
  const actionChain = createChainWithReporting([
    { fn: createFiles, message: 'Creating files...' },
    { fn: installPackages, message: 'Installing Packages...' },
  ], 'Successfully initialized your repository, have fun! (see README for help)');

  await actionChain({ answers });
};

/**
 * Command to initialize the users repository so it can run our cli.
 */
export const initializeCommand = new Command()
  .name('init')
  .hook('preAction', printFestiveTitle)
  .description('Initialize a directory so advent-of-code-runner can run solutions.')
  .action(initialize);
