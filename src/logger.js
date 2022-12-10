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
};

addColors({
  festive: 'black',
  error: 'red',
  warn: 'yellow',
  info: 'green',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'magenta',
});

let loggingConfig;

try {
  // If for some reason configuration fails to load while setting up logger
  // ensure that this failure at least gets logged to the console.
  loggingConfig = getConfigValue('logging');
} catch (error) {
  console.error('Failed to load logging config!');
  exit(1);
}

export const logger = createLogger({
  levels: customLevels,
  format: format.combine(
    format.errors({ stack: loggingConfig.printStackTrace }),
    format.splat(),
    format.json(),
  ),
  transports: [
    new transports.Console({
      level: loggingConfig.level,
      format: format.combine(
        format.colorize(),
        // format.simple would be nice to use, but doesn't print a human readable stack trace.
        // write a custom printf that mirrors format.simple, but prints a better stack trace.
        format.printf(({ level, message, stack }) => {
          if (loggingConfig.printStackTrace && stack) {
            return `${level}: ${message} - ${stack}`;
          }
          return `${level}: ${message}`;
        }),
      ),
    }),
    new FestiveTransport({
      level: 'festive',
    }),
  ],
});
