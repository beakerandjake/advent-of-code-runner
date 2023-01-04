import { getConfigValue } from '../../config.js';

/**
 * Grabs the authentication token value from the config, validates it, then adds it to the args.
 * @throws {Error} The token was empty
 */
export const getAuthenticationToken = () => {
  const authToken = getConfigValue('aoc.authenticationToken');

  if (!authToken) {
    throw new Error('Could not get authentication token from .env file, this should have been set during the "init" command');
  }

  return { authToken };
};
