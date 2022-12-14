import { Command } from 'commander';
import inquirer from 'inquirer';
import { getConfigValue } from '../config.js';
import { PackageJsonNotFoundError } from '../errors/index.js';
import { festiveEmoji, festiveErrorStyle, festiveStyle } from '../festive.js';
import { packageJsonExists } from '../initialize.js';
import {
  createDotEnv, createGitIgnore, createPackageJson, createReadme, createSolutionFiles,
} from '../initialize/index.js';
import { logger } from '../logger.js';

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
  await createPackageJson(answers.year),
  await createGitIgnore(),
  await createReadme(),
  await createSolutionFiles(),
  await createDotEnv(answers),
]);

const command = new Command();

command
  .name('init')
  .description('Initialize a directory so advent-of-code-runner can run solutions.')
  .action(async () => {
    logger.festive('Performing first time setup');
    logger.festive(`For help see README (${getConfigValue('meta.homepage')})`);

    // TODO instead of confirm, just bail if cwd is not empty (allow .git folder only).

    // // confirm with the user first.
    // const { confirmed } = await inquirer.prompt(confirmOperation);

    // // bail if user did't confirm.
    // if (!confirmed) {
    //   return;
    // }

    // // get the required input from the user.
    // const answers = await inquirer.prompt(questions);

    await createFiles(answers);

    // initialize folder, break up into separate files.
    // have text files where possible to just do a straight copy (git ignore, readme)

    // logger.festive('Initializing Repository for year: %s', year);

    // await Promise.all([
    //   createSolutionFiles(year),
    //   updateGitIgnore(),
    //   createEnvFile('need a real token', year),
    //   createDataFile(),
    // ]);
  });

export const initCommand = command;
