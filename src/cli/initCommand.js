import { Command } from 'commander';
import { cwd } from 'process';
import { join } from 'path';
import { createSolutionFiles, updateGitIgnore } from '../initialize.js';
import { logger } from '../logger.js';
import { yearOption } from './arguments.js';

const command = new Command();

/**
 * TODO
 * - use inquirer for customization
 * - ask for filepath (default to cwd)
 * - create .env file
 * - add token to .env file
 * - update gitignore to exclude .env
 * - update package.json to add run script?
 */

command
  .name('init')
  .description('Initialize a directory so advent-of-code-runner can run solutions.')
  .addOption(yearOption)
  .action(async ({ year }) => {
    logger.festive('Initializing Repository for year: %s', year);

    const rootDirectory = join(cwd(), 'init');

    await createSolutionFiles(rootDirectory, year);
    await updateGitIgnore(rootDirectory);
  });

export const initCommand = command;
