#!/usr/bin/env node
import { Command } from 'commander';
import { getConfigValue } from './config.js';
import { printFestiveTitle } from './festive.js';
import { handleError } from './errorHandler.js';
import {
  autoSolveCommand,
  initializeCommand,
  solveCommand,
  submitCommand,
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

program.addCommand(autoSolveCommand);
program.addCommand(solveCommand);
program.addCommand(submitCommand);
program.addCommand(initializeCommand);

try {
  await program.parseAsync();
} catch (error) {
  handleError(error);
}
