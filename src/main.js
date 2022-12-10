import { Command } from 'commander';
import { exit } from 'process';
import { solveCommand, submitCommand } from './cli/index.js';
import { initCommand } from './cli/initCommand.js';
import { getConfigValue } from './config.js';
import { printFestiveTitle } from './festive.js';
import { logger } from './logger.js';

const program = new Command();

program
  .name(getConfigValue('meta.name'))
  .description(getConfigValue('meta.description'))
  .version(getConfigValue('meta.version'))
  .addHelpText('beforeAll', printFestiveTitle)
  .hook('preAction', printFestiveTitle)
  .exitOverride((error) => {
    // handle edge case when help is displayed
    // exit instead of throwing error.
    if (error.code === 'commander.help' || error.code === 'commander.version') {
      exit(1);
    }

    throw error;
  });

program.addCommand(solveCommand);
program.addCommand(submitCommand);
program.addCommand(initCommand);

try {
  await program.parseAsync();
} catch (error) {
  logger.error(error);
  exit(1);
}

// Submit Problem

// provide way to clear local data.
// when initing solution file, download puzzle text and add as comment in file.

// progress command, list unsolved problems

// solution errors, all in one file. all derived from base solution error type.
// write custom error handler for program that displays solution errors to the user differently.
