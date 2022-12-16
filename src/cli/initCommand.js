import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { getConfigValue } from '../config.js';
import { festiveEmoji, festiveStyle } from '../festive.js';
import {
  createDataFile,
  createDotEnv,
  createGitIgnore,
  createPackageJson,
  createReadme,
  createSolutionFiles,
  cwdIsEmpty,
  installPackages,
} from '../initialize/index.js';

/**
 * Inquirer question which makes the user confirm the initialize operation.
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
    validate: (input) => (input ? true : chalk.bold.italic.red('Token cannot be empty!')),
    filter: (input) => input.trim(),
  },
];

const command = new Command();

command
  .name('init')
  .description('Initialize a directory so advent-of-code-runner can run solutions.')
  .action(async () => {
    // if directory is not empty, confirm with the user to continue.
    if (!await cwdIsEmpty() && !(await inquirer.prompt(confirmInitializeQuestion)).confirmed) {
      return;
    }

    // get the required input from the user.
    const answers = await inquirer.prompt(questions);

    // now that we have everything we need from the user we can initialize.
    const spinner = ora({ text: festiveStyle('Creating files'), spinner: 'christmas' }).start();

    try {
      // create the files in the users cwd
      await Promise.all([
        createPackageJson(answers.year),
        createGitIgnore(),
        createReadme(),
        createSolutionFiles(),
        createDotEnv(answers),
        createDataFile(),
      ]);

      // now that files (including package.json) are present, install the users npm packages.
      spinner.text = festiveStyle('Installing packages');
      await installPackages();

      spinner.stopAndPersist({
        text: festiveStyle('Successfully initialized your repository, have fun!'),
        symbol: festiveEmoji(),
      });
    } catch (error) {
      spinner.fail();
      throw error;
    }
  });

export const initCommand = command;
