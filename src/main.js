#!/usr/bin/env node
import { Command } from 'commander';
import { authAction } from './commands/auth.js';
import { initAction } from './commands/init.js';
import { solveAction } from './commands/solve.js';
import { statsAction } from './commands/stats.js';
import { submitAction } from './commands/submit.js';
import { importAction } from './commands/import.js';
import { getConfigValue } from './config.js';
import { handleError } from './errorHandler.js';
import { getDayArg, getLevelArg } from './arguments.js';
import { printFestiveTitle } from './festive.js';

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
    .action(initAction);

  // add the import command
  program
    .command('import')
    .description(
      'Store the correct answer to a puzzle solved outside of this project.'
    )
    .option(
      '--no-confirm',
      'Does not ask for confirmation if puzzle already exists in data file'
    )
    .addArgument(getDayArg(true))
    .addArgument(getLevelArg(true))
    .argument('<answer>', 'The correct answer to the puzzle')
    .addHelpText(
      'after',
      [
        '',
        'Example Calls:',
        `  import 10 1 123456         Stores correct answer "123456" for day 10 level 1`,
        `  import 5 2 'hello world'   Stores correct answer "hello world" for day 5 level 2`,
        `  import 1 1 \\ -123456       Stores correct answer "-123456" for day 1 level 1`,
      ].join('\n')
    )
    .action(importAction);

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
    .addArgument(getDayArg(false))
    .addArgument(getLevelArg(false))
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
    .addArgument(getDayArg(false))
    .addArgument(getLevelArg(false))
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
