import { Command } from 'commander';
import { createChain } from '../actions/actionChain.js';
import * as actions from '../actions/index.js';
import { festiveStyle, printFestiveTitle } from '../festive.js';
import { createDotEnv } from '../initialize/index.js';
import { logger } from '../logger.js';
import { dotEnvExists } from '../validation/userFilesExist.js';

/**
 * inquirer questions which can be used to prompt the user to input their auth token.
 */
export const authTokenQuestion = {
  type: 'password',
  message: festiveStyle(
    'Enter your advent of code authentication token (see README for help)'
  ),
  mask: true,
  validate: (input) => (input ? true : 'Token cannot be empty!'),
};

/**
 * inquirer question which makes the user confirm the overwriting the .env file
 */
const confirmQuestion = {
  message: festiveStyle(
    'It appears a .env file is already present, do you want to overwrite this file?'
  ),
  default: false,
};

/**
 * Updates or creates the .env file and writes the users auth token to it.
 * @private
 */
export const authAction = async () => {
  const actionChain = createChain([
    actions.assertInitialized,
    actions.and(dotEnvExists, actions.assertUserConfirmation),
    actions.getAnswersFromUser,
    createDotEnv,
  ]);

  await actionChain({
    confirmQuestion,
    questions: {
      authToken: authTokenQuestion,
    },
  });

  logger.festive(
    'Added auth token to the .env file, do not commit this file to source control'
  );
};

/**
 * Adds or updates the .env file with the users auth token.
 */
export const authCommand = new Command()
  .name('auth')
  .hook('preAction', printFestiveTitle)
  .description('Add or update the .env file with your advent of code auth token.')
  .action(authAction);
