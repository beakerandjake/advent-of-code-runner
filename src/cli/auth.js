import { confirm, password } from '@inquirer/prompts';
import { DirectoryNotInitializedError } from '../errors/cliErrors.js';
import { festiveStyle } from '../festive.js';
import { createDotEnv } from '../initialize/index.js';
import { logger } from '../logger.js';
import { dataFileExists, dotEnvExists } from '../validation/userFilesExist.js';

/**
 * prompt for an inquirer password which asks the user for their auth token.
 */
export const authTokenPrompt = {
  message: festiveStyle(
    'Enter your advent of code authentication token (see README for help)'
  ),
  mask: true,
  validate: (input) => (input ? true : 'Token cannot be empty!'),
};

/**
 * prompt for an inquirer confirm which makes the user confirm the overwriting the .env file.
 */
const confirmPrompt = {
  message: festiveStyle(
    'It appears a .env file is already present, do you want to overwrite this file?'
  ),
  default: false,
};

/**
 * Updates the users .env file with the an advent of code auth token.
 */
export const authAction = async () => {
  // bail if not initialized.
  if (!(await dataFileExists())) {
    throw new DirectoryNotInitializedError();
  }
  // if a .env file is present, ask the user for confirmation to proceed
  if ((await dotEnvExists()) && !(await confirm(confirmPrompt))) {
    logger.debug('not updating the .env file because user did not confirm');
    return;
  }
  const token = await password(authTokenPrompt);
  if (!token) {
    throw new Error('password prompt returned empty token');
  }
  await createDotEnv(token);
  logger.festive(
    'Added auth token to .env file, do not commit this file to source control'
  );
};
