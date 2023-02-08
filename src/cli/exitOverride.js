import { exit } from 'node:process';

/**
 * Error codes which are raised by commanded.
 * These codes will trigger a program exit instead of throwing the exception.
 * @private
 */
export const commanderErrorCodes = [
  'commander.help',
  'commander.version',
  'commander.helpDisplayed',
  'commander.unknownCommand',
];

/**
 * Exit override function which can be passed to commanders exitOverride.
 * @param {Error} error
 */
export const exitOverride = (error) => {
  // handle edge case when help is displayed
  // exit instead of throwing error.
  if (commanderErrorCodes.includes(error.code)) {
    exit(1);
  }

  throw error;
};
