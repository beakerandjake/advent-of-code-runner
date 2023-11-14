#!/usr/bin/env node
import { Argument, Command, InvalidArgumentError } from 'commander';
import { authAction } from './commands/auth.js';
import { initializeAction } from './commands/initialize.js';
import { solveAction } from './commands/solve.js';
import { statsAction } from './commands/stats.js';
import { submitAction } from './commands/submit.js';
import { getConfigValue } from './config.js';
import { handleError } from './errorHandler.js';
import { printFestiveTitle } from './festive.js';

/**
 * Returns a function which parses the string value as an integer.
 * Then compares the parsed integer value to an array of choices.
 * The returned function throws an InvalidArgumentError if the value is not included in the choices.
 * @param {number[]} choices - The valid options to choose from
 * @throws {RangeError} - The parsed integer value was not included in the choices.
 */
export const intParser = (choices) => (value) => {
  const parsed = Number.parseInt(value, 10);
  if (!choices.includes(parsed)) {
    const min = Math.min(...choices);
    const max = Math.max(...choices);
    throw new InvalidArgumentError(`Value must be between ${min} and ${max}.`);
  }
  return parsed;
};

try {
  const program = new Command();

  // configure basic information.
  program
    .name(getConfigValue('meta.name'))
    .description(getConfigValue('meta.description'))
    .version(getConfigValue('meta.version'))
    .addHelpText('before', printFestiveTitle);

  // add the auth command
  program
    .command('auth')
    .hook('preAction', printFestiveTitle)
    .description(
      'Add or update the .env file with your advent of code auth token.'
    )
    .action(authAction);

  // add the init command
  program
    .command('init')
    .hook('preAction', printFestiveTitle)
    .description('Scaffold an empty directory.')
    .action(initializeAction);

  const dayArgument = new Argument(
    '[day]',
    'The day of the puzzle to solve (1-25).'
  ).argParser(intParser(getConfigValue('aoc.validation.days')));

  const levelArgument = new Argument(
    '[level]',
    `The the level of the puzzle to solve (1 or 2).`
  ).argParser(intParser(getConfigValue('aoc.validation.levels')));

  // add the solve command
  program
    .command('solve')
    .description(
      'Runs your solution for a puzzle, measures the runtime, and outputs the answer.'
    )
    .addHelpText(
      'after',
      [
        '',
        'Example Calls:',
        '  solve                Finds and solves your next unsolved puzzle',
        '  solve [day]          Solves level one of the specified days puzzle',
        '  solve [day] [level]  Solves the puzzle for the specified day and level',
      ].join('\n')
    )
    .addArgument(dayArgument)
    .addArgument(levelArgument)
    .action(solveAction);

  // add the submit command
  program
    .command('submit')
    .description(
      'Runs your solution for a puzzle and submits the answer to advent of code.`'
    )
    .addHelpText(
      'after',
      [
        '',
        'Example Calls:',
        '  submit                Finds and submits your next unsolved puzzle',
        '  submit [day]          Submits level one of the specified days puzzle',
        '  submit [day] [level]  Submits the puzzle for the specified day and level',
      ].join('\n')
    )
    .addArgument(dayArgument)
    .addArgument(levelArgument)
    .action(submitAction);

  // add the stats command
  program
    .command('stats')
    .description(
      'Output your completion progress for the years advent of code.'
    )
    .option('--save', 'Save your completion progress to the README file')
    .action(statsAction);

  // now that the cli is build, run the program.
  await program.parseAsync();
} catch (error) {
  handleError(error);
}
