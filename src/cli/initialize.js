import { Command } from 'commander';
import { createChainWithProgress } from '../actions/actionChainWithProgress.js';
import { assertUserConfirmation, getAnswersFromUser } from '../actions/index.js';
import { getConfigValue } from '../config.js';
import { festiveStyle, printFestiveTitle } from '../festive.js';
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
} from '../initialize/index.js';
import { authTokenQuestion } from './auth.js';

/**
 * inquirer.js question which makes the user confirm the initialize operation.
 */
const confirmQuestion = {
  type: 'confirm',
  message: festiveStyle(
    'This directory is not empty! This operation will overwrite files, do you want to continue?'
  ),
  default: false,
};

const initializeQuestions = {
  year: {
    // in future if list of years becomes too large the change to raw input.
    type: 'select',
    message: festiveStyle('What year of advent of code are you doing?'),
    choices: [...getConfigValue('aoc.validation.years')]
      .reverse()
      .map((year) => ({ value: year })),
    loop: false,
  },
  authToken: authTokenQuestion,
};

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
 * The action that is invoked by commander.
 * @private
 */
export const initializeAction = async () => {
  // if there are files in the cwd, get confirmation with the user that they want to proceed.
  if (!(await cwdIsEmpty()) && !(await assertUserConfirmation({ confirmQuestion }))) {
    return;
  }

  // get all the info we need in order to initialize.
  const answers = await getAnswersFromUser({ questions: initializeQuestions });

  // run initialize steps in an action chain that reports its progress to the user.
  const actionChain = createChainWithProgress(
    [
      { fn: createFiles, message: 'Creating files...' },
      { fn: installPackages, message: 'Installing Packages...' },
    ],
    'Successfully initialized your repository, have fun! (see README for help)'
  );

  await actionChain({ answers });
};

/**
 * Command to initialize the users repository so it can run our cli.
 */
export const initializeCommand = new Command()
  .name('init')
  .hook('preAction', printFestiveTitle)
  .description('Initialize the directory so this CLI can run.')
  .action(initializeAction);
