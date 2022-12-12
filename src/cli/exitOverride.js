import { exit } from 'process';

/**
 * Exit override function which can be passed to commanders exitOverride.
 * @param {Error} error
 */
export const exitOverride = (error) => {
  // handle edge case when help is displayed
  // exit instead of throwing error.
  if (error.code === 'commander.help' || error.code === 'commander.version' || error.code === 'commander.helpDisplayed') {
    exit(1);
  }

  throw error;
};
