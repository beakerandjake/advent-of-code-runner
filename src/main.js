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