import { Command } from 'commander';
import { exit, argv } from 'process';
import { solveCommand, submitCommand } from './cli/index.js';
import { logger } from './logger.js';

const program = new Command();

program
  .name('advent-of-code-runner')
  .description('CLI to save Christmas')
  .version('')
  .exitOverride();

program.addCommand(solveCommand);
program.addCommand(submitCommand);

try {
  await program.parseAsync(argv);
} catch (error) {
  logger.error('%s', error);
  exit(1);
}

// Submit Problem

// Hash the session token and store which problems have been solved
// prevent re-submissions
// store last submission time, don't allow submission if too soon
// provide way to clear local data.

// init command to scaffold solution files for an entire year
//  create a day_x.js file for each day of that month.
//  skip creation of files that already exist.

// route solution logs to winston with custom log level and color.

// when initing solution file, download puzzle text and add as comment in file.