#!/usr/bin/env node
import { Command } from 'commander';
import { getConfigValue } from './config.js';
import { printFestiveTitle } from './festive.js';
import { handleError } from './errorHandler.js';
import {
  autoSolveCommand,
  autoSubmitCommand,
  solveCommand,
  submitCommand,
  exitOverride,
} from './cli/index.js';
import { statsCommand } from './cli/commands/stats.js';
import { initializeCommand } from './cli/commands/initialize.js';

const program = new Command();

program
  .name(getConfigValue('meta.name'))
  .description(getConfigValue('meta.description'))
  .version(getConfigValue('meta.version'))
  .addHelpText('before', printFestiveTitle)
  .exitOverride(exitOverride);

program.addCommand(autoSolveCommand);
program.addCommand(solveCommand);
program.addCommand(autoSubmitCommand);
program.addCommand(submitCommand);
program.addCommand(initializeCommand);
program.addCommand(statsCommand);

try {
  await program.parseAsync();
} catch (error) {
  handleError(error);
}
