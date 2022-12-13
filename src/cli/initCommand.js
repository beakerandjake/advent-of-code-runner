import { Command } from 'commander';
import inquirer from 'inquirer';
import { getConfigValue } from '../config.js';
import { festiveEmoji } from '../festive.js';
import {
  createEnvFile, createDataFile, createSolutionFiles, updateGitIgnore,
} from '../initialize.js';
import { logger } from '../logger.js';
import { yearIsValid } from '../validatePuzzle.js';
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
    message: 'What year of advent of code are you doing?',
    default: 2022,
    prefix: festiveEmoji(),
    choices: getConfigValue('aoc.puzzleValidation.years'),
    loop: false,
  },
];

const command = new Command();

command
  .name('init')
  .description('Initialize a directory so advent-of-code-runner can run solutions.')
  .addOption(yearOption)
  .action(async ({ year }) => {
    logger.festive('Performing first time setup');

    // const { confirmed } = await inquirer.prompt(confirmOperation);

    // if (!confirmed) {
    //   return;
    // }
    try {
      const results = await inquirer.prompt(questions);
      logger.festive('results: %s', results);
    } catch (error) {
      logger.error('FUCK', error);
    }

    // logger.festive('Initializing Repository for year: %s', year);

    // await Promise.all([
    //   createSolutionFiles(year),
    //   updateGitIgnore(),
    //   createEnvFile('need a real token', year),
    //   createDataFile(),
    // ]);
  });

export const initCommand = command;
