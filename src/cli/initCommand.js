import { Command } from 'commander';
import inquirer from 'inquirer';
import { getConfigValue } from '../config.js';
import { PackageJsonNotFoundError } from '../errors/index.js';
import { festiveEmoji, festiveErrorStyle, festiveStyle } from '../festive.js';
import {
  createEnvFile, createDataFile, createSolutionFiles, updateGitIgnore, packageJsonExists,
} from '../initialize.js';
import { logger } from '../logger.js';
import { yearOption } from './arguments.js';

const confirmOperation = {
  type: 'confirm',
  name: 'confirmed',
  message: 'This action should only be performed in an empty repository. It can overwrite files that already exist (such as README, .gitignore, .env). Do you want to continue?',
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
    type: 'input',
    name: 'token',
    message: festiveStyle(
      `Enter your advent of code authentication token, see README for help (${getConfigValue('meta.homepage')})`,
    ),
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
  .addOption(yearOption)
  .action(async ({ year }) => {
    logger.festive('Performing first time setup');

    // most important thing is user has a package.json file.
    if (!await packageJsonExists()) {
      throw new PackageJsonNotFoundError();
    }

    // const { confirmed } = await inquirer.prompt(confirmOperation);

    // if (!confirmed) {
    //   return;
    // }
    const results = await inquirer.prompt(questions);
    logger.festive('results: %s', results);

    // logger.festive('Initializing Repository for year: %s', year);

    // await Promise.all([
    //   createSolutionFiles(year),
    //   updateGitIgnore(),
    //   createEnvFile('need a real token', year),
    //   createDataFile(),
    // ]);
  });

export const initCommand = command;
