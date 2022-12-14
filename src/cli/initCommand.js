import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import { getConfigValue } from '../config.js';
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

const command = new Command();

command
  .name('init')
  .description('Initialize a directory so advent-of-code-runner can run solutions.')
  .action(async () => {
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
