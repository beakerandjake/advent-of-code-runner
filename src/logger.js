import {
  createLogger, format, transports, addColors,
} from 'winston';
import { exit } from 'process';
import { getConfigValue } from './config.js';
import { FestiveTransport } from './festive.js';

/**
 * custom levels based on npm levels.
 * adds festive level meant for output
 * always printed to the user.
 */
const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5,
  festive: 6,
  festiveError: 7,
};

addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'magenta',
  // festive error colors don't matter
  // they are handled by the festive transport not colorize.
  festive: 'black',
  festiveError: 'black',
});

let loggerInstance;

try {
  // If for some reason logger fails to set up fail the program early.
  const level = getConfigValue('logging.level');

  loggerInstance = createLogger({
    levels: customLevels,
    format: format.combine(
      format.splat(),
      format.json(),
      format.errors({ stack: true }),
    ),
    transports: [
      new transports.Console({
        level,
        format: format.combine(
          format.colorize({ all: true }),
          // format.simple would be nice to use but we need more customization
          format.printf((info) => {
            if (info.stack) {
              return `${info.level}: ${info.stack}`;
            }

            return `${info.level}: ${info.message}`;
          }),
        ),
      }),
      new FestiveTransport({
        level: 'festiveError',
      }),
    ],
  });
} catch (error) {
  console.error('Failed to create logger!', error);
  exit(1);
}

export const logger = loggerInstance;
