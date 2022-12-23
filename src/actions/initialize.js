import ora from 'ora';
import { getConfigValue } from '../config.js';
import { festiveEmoji, festiveStyle } from '../festive.js';
import {
  createDataFile,
  createDotEnv,
  createGitIgnore,
  createPackageJson,
  createReadme,
  createSolutionFiles,
  installPackages,
} from '../initialize/index.js';
import { createChain } from './actionChain.js';
import { getAnswersFromUser } from './links/getAnswersFromUser.js';
import {
  assertInitialized,
  assertUserConfirmation,
  not,
  or,
} from './links/index.js';

/**
 * inquirer.js question which makes the user confirm the initialize operation.
 */
export const confirmInitializeQuestion = {
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
export const initializeQuestions = [
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
    createDataFile(answers),
    createDotEnv(answers),
    createGitIgnore(answers),
    createPackageJson(answers),
    createReadme(answers),
    createSolutionFiles(answers),
  ]);
};

/**
 * Performs first time setup, scaffolds the cwd with all of the files required to run this cli.
 */
export const initialize = async () => {
  // could be some long running operations here, we will use a spinner
  // to let the user know it's not frozen.
  const spinner = ora({ spinner: 'christmas' });

  const actionChain = createChain([
    // halt the chain the cwd is not empty and the user does not confirm
    or(not(assertInitialized), assertUserConfirmation(confirmInitializeQuestion)),
    // grab year / auth token from user.
    getAnswersFromUser(initializeQuestions),
    // create all required files in the cwd.
    () => spinner.start(festiveStyle('Creating files')),
    createFiles,
    // install npm packages for the user.
    () => { spinner.text = festiveStyle('Installing packages'); },
    installPackages,
  ]);

  try {
    const completed = await actionChain();
    // make sure we stop the spinner when the chain finishes.
    completed && spinner.succeed(festiveStyle('Successfully initialized your repository, have fun!'));
  } catch (error) {
    spinner.fail();
    throw error;
  }
};
