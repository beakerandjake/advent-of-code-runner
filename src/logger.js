import {
  createLogger, format, transports, addColors,
} from 'winston';
import { exit } from 'node:process';
import { LEVEL, MESSAGE } from 'triple-beam';
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
  error: 'red',
  warn: 'yellow',
  info: 'green',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'magenta',
  // festive error colors don't matter
  // they are handled by the festive transport not colorize.
  festive: 'black',
});

const simpleFormat = format.simple();

let loggerInstance;

try {
  // If for some reason logger fails to set up fail the program early.
  const level = getConfigValue('logging.level');

  loggerInstance = createLogger({
    levels: customLevels,
    format: format.combine(
      format.errors({ stack: true }),
      format.splat(),
      format.json(),
    ),
    transports: [
      new transports.Console({
        level,
        format: format.combine(
          // format.simple would be nice to use but we need more customization
          format.printf((info) => {
            if (info[LEVEL] === 'error' && !info.useDefaultFormat) {
              return `${info.level}: ${info.stack ? info.stack : info.message}`;
            }

            return simpleFormat.transform(info)[MESSAGE];
          }),
          format.colorize({ all: true }),
        ),
      }),
      new FestiveTransport({
        level: 'festive',
      }),
    ],
  });
} catch (error) {
  console.error('Failed to create logger!', error);
  exit(1);
}

export const logger = loggerInstance;
