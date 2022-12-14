import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import { festiveEmoji, festiveErrorStyle, festiveStyle } from '../festive.js';
import {
  createDataFile,
  createDotEnv,
  createGitIgnore,
  createPackageJson,
  createReadme,
  createSolutionFiles,
  installPackages,
} from '../initialize/index.js';

const confirmOperation = {
  type: 'confirm',
  name: 'confirmed',
  message: festiveStyle(
    'This action should only be performed in a new repository. It can overwrite files that might already exist (such as README, .gitignore, .env). Do you want to continue?',
  ),
  default: true,
  prefix: festiveEmoji(),
};

const questions = [
  {
    // in future if list of years becomes too large the change to raw input.
    type: 'list',
    name: 'year',
    message: festiveStyle('What year of advent of code are you doing?'),
    prefix: festiveEmoji(),
    choices: getConfigValue('aoc.puzzleValidation.years').reverse(),
    loop: false,
  },
  {
    // in future if list of years becomes too large the change to raw input.
    type: 'password',
    name: 'authToken',
    message: festiveStyle('Enter your advent of code authentication token'),
    prefix: festiveEmoji(),
    choices: getConfigValue('aoc.puzzleValidation.years'),
    loop: false,
    validate: (input) => (input ? true : festiveErrorStyle('Token cannot be empty!')),
    filter: (input) => input.trim(),
  },
];

/**
 * Creates all template files in the CWD
 * @param {Object} answers - The answers object provided by inquirer.
 */
const createFiles = async (answers) => Promise.all([
  createPackageJson(answers.year),
  createGitIgnore(),
  createReadme(),
  createSolutionFiles(),
  createDotEnv(answers),
  createDataFile(),
  new Promise((resolve) => setTimeout(resolve, 5000)),
]);

const reportStatus = async (promise, spinner, startText, successText, failText = undefined) => {
  spinner.start(festiveStyle(startText));

  try {
    await promise;
    spinner.stopAndPersist({
      text: festiveStyle(successText),
      symbol: festiveEmoji(),
    });
  } catch (error) {
    spinner.fail(failText ? festiveErrorStyle(failText) : festiveErrorStyle(startText));
    throw error;
  }
};

const command = new Command();

command
  .name('init')
  .description('Initialize a directory so advent-of-code-runner can run solutions.')
  .action(async () => {
    // get the required input from the user.
    const answers = await inquirer.prompt(questions);

    const spinner = ora({ text: festiveStyle('Initializing'), spinner: 'christmas' }).start();

    await reportStatus(
      createFiles(answers),
      spinner,
      'Creating files',
      'Created files',
    );

    await reportStatus(
      installPackages(),
      spinner,
      'Installing npm packages',
      'Installed npm packages',
    );

    spinner.stopAndPersist({
      text: festiveStyle('Successfully initialized your repository, have fun!'),
      symbol: festiveEmoji(),
    });
  });

export const initCommand = command;
