import { Command } from 'commander';
import {
  createEnvFile, createDataFile, createSolutionFiles, updateGitIgnore,
} from '../initialize.js';
import { logger } from '../logger.js';
import { yearOption } from './arguments.js';

const command = new Command();

command
  .name('init')
  .description('Initialize a directory so advent-of-code-runner can run solutions.')
  .addOption(yearOption)
  .action(async ({ year }) => {
    logger.festive('Initializing Repository for year: %s', year);

    await Promise.all([
      createSolutionFiles(year),
      updateGitIgnore(),
      createEnvFile('need a real token', year),
      createDataFile(),
    ]);
  });

export const initCommand = command;
