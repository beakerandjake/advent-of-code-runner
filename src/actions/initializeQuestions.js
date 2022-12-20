import chalk from 'chalk';
import { getConfigValue } from '../config.js';
import { festiveEmoji, festiveStyle } from '../festive.js';

/**
 * inquirer.js question which makes the user confirm the initialize operation.
 */
export const confirmOverwriteCwdQuestion = {
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
    validate: (input) => (input ? true : chalk.bold.italic.red('Token cannot be empty!')),
    filter: (input) => input.trim(),
  },
];
