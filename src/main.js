import { Command } from 'commander';
import { exit } from 'process';
import { solveCommand, submitCommand } from './cli/index.js';
import { testCommand } from './cli/testCommand.js';
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
program.addCommand(testCommand);

try {
  await program.parseAsync();
} catch (error) {
  logger.error(error);
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
