import { Command } from 'commander';
import { printFestiveTitle } from '../festive.js';

const auth = async () => {
  console.log('auth it!');
};

/**
 * Command to initialize the users repository so it can run our cli.
 */
export const authCommand = new Command()
  .name('auth')
  .hook('preAction', printFestiveTitle)
  .description('Add or update the .env file with your advent of code auth token.')
  .action(auth);
