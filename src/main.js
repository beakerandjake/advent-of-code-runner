import { Command } from 'commander';
import { getConfigValue } from './config.js';
import { printFestiveTitle } from './festive.js';
import { handleError } from './errorHandler.js';
import {
  solveCommand,
  submitCommand,
  initCommand,
  exitOverride,
} from './cli/index.js';

const program = new Command();

program
  .name(getConfigValue('meta.name'))
  .description(getConfigValue('meta.description'))
  .version(getConfigValue('meta.version'))
  .addHelpText('beforeAll', printFestiveTitle)
  .hook('preAction', printFestiveTitle)
  .exitOverride(exitOverride);

program.addCommand(solveCommand);
program.addCommand(submitCommand);
program.addCommand(initCommand);

try {
  await program.parseAsync();
} catch (error) {
  handleError(error);
}

// Submit Problem

// provide way to clear local data.
// when initing solution file, download puzzle text and add as comment in file.

// progress command, list unsolved problems

// solution errors, all in one file. all derived from base solution error type.
// write custom error handler for program that displays solution errors to the user differently.
