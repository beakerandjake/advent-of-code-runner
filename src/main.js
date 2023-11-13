#!/usr/bin/env node
import { Command } from 'commander';
import { authCommand } from './cli/auth.js';
import { initializeCommand } from './cli/initialize.js';
import { solveCommand } from './cli/solve.js';
import { statsCommand } from './cli/stats.js';
import { submitCommand } from './cli/submit.js';
import { getConfigValue } from './config.js';
import { handleError } from './errorHandler.js';
import { printFestiveTitle } from './festive.js';

const program = new Command();

program
  .name(getConfigValue('meta.name'))
  .description(getConfigValue('meta.description'))
  .version(getConfigValue('meta.version'))
  .addHelpText('before', printFestiveTitle);

program.addCommand(authCommand);
program.addCommand(initializeCommand);
program.addCommand(solveCommand);
program.addCommand(submitCommand);
program.addCommand(statsCommand);

try {
  await program.parseAsync();
} catch (error) {
  handleError(error);
}
