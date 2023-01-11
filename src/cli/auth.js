import { Command } from 'commander';
import { getAnswersFromUser } from '../actions/getAnswersFromUser.js';
import { festiveEmoji, festiveStyle, printFestiveTitle } from '../festive.js';
import { cwdIsEmpty, createDotEnv } from '../initialize/index.js';
import { logger } from '../logger.js';

/**
 * inquirer question which prompts the user for their auth token.
 */
export const authTokenQuestion = {
  type: 'password',
  name: 'authToken',
  message: festiveStyle('Enter your advent of code authentication token'),
  prefix: festiveEmoji(),
  validate: (input) => (input ? true : 'Token cannot be empty!'),
  filter: (input) => input.trim(),
};

const auth = async () => {
  if (!await cwdIsEmpty()) {
    logger.error('This directory does not appear to be initialized, please run the "init" command instead');
    return;
  }

  const { answers } = await getAnswersFromUser([authTokenQuestion])();
  await createDotEnv(answers);
};

/**
 * Adds or updates the .env file with the users auth token.
 */
export const authCommand = new Command()
  .name('auth')
  .hook('preAction', printFestiveTitle)
  .description('Add or update the .env file with your advent of code auth token.')
  .action(auth);
