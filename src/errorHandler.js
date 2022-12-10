import { exit } from 'process';
import { logger } from './logger.js';

/**
 * Handle an error raised by the application and exit.
 * @param {Error} error
 */
export const handleError = (error) => {
  logger.error(error);
  exit(1);
};
