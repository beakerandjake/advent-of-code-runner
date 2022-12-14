import { exit } from 'node:process';
import { UserError } from './errors/index.js';
import { logger } from './logger.js';

/**
 * Handle an error raised by the application and exit.
 * @param {Error} error
 */
export const handleError = (error) => {
  let errorLog = logger.error;

  if (error instanceof UserError) {
    errorLog = logger.festiveError;
  }

  errorLog(error);
  exit(1);
};
