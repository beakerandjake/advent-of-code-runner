import { Command } from 'commander';
import { assertInitialized } from '../actions/assertInitialized.js';
import { assertUserConfirmation } from '../actions/assertUserConfirmation.js';
import { getAnswersFromUser } from '../actions/getAnswersFromUser.js';
import { festiveEmoji, festiveStyle, printFestiveTitle } from '../festive.js';
import { createDotEnv, dotEnvFileExists } from '../initialize/index.js';
import { logger } from '../logger.js';

/**
 * inquirer question which prompts the user for their auth token.
 */
/* istanbul ignore next */
export const authTokenQuestion = {
  type: 'password',
  name: 'authToken',
  message: festiveStyle('Enter your advent of code authentication token'),
  prefix: festiveEmoji(),
  validate: (input) => (input ? true : 'Token cannot be empty!'),
  filter: (input) => input.trim(),
};

/**
 * inquirer.js question which makes the user confirm the overwriting the .env file
 */
const confirmOverwriteQuestion = {
  type: 'confirm',
  name: 'confirmed',
  message: festiveStyle(
    'It appears a .env file is already present, do you want to overwrite this file?',
  ),
  default: false,
  prefix: festiveEmoji(),
};

/**
 * Updates or creates the .env file and writes the users auth token to it.
 * @private
 */
export const auth = async () => {
  // don't let the user run this command if they haven't ran the "init" command.
  if (!await assertInitialized()) {
    return;
  }

  // if there is already a .env file then ask users confirmation.
  if (await dotEnvFileExists() && !await assertUserConfirmation(confirmOverwriteQuestion)()) {
    return;
  }

  const { answers } = await getAnswersFromUser([authTokenQuestion])();
  await createDotEnv(answers);
  logger.festive('Added auth token to the .env file, do not commit this file to source control');
};

/**
 * Adds or updates the .env file with the users auth token.
 */
export const authCommand = new Command()
  .name('auth')
  .hook('preAction', printFestiveTitle)
  .description('Add or update the .env file with your advent of code auth token.')
  .action(auth);
