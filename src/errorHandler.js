import { exit } from 'node:process';
import { UserError } from './errors/index.js';
import { logger } from './logger.js';

/**
 * Handle an error raised by the application and exit.
 * @param {Error} error
 */
export const handleError = (error) => {
  if (error instanceof UserError) {
    logger.error(error, { useDefaultFormat: true });
  } else {
    logger.error(error);
  }

  exit(1);
};
