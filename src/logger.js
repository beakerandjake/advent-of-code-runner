import { createLogger, format, transports } from 'winston';
import { getConfigValue } from './config.js';

const loggingConfig = {
  level: 'info',
  printStackTrace: false
};

// If for some reason configuration fails to load while setting up logger
// ensure that this failure at least gets logged to the console.  

try {
  loggingConfig.level = getConfigValue('logging.level');
  loggingConfig.printStackTrace = getConfigValue('logging.includeStackTrace');
} catch (error) {
  console.error('Failed to load logging config!');
  throw error;
}

export const logger = createLogger({
  level: loggingConfig.level,
  format: format.combine(
    format.errors({ stack: loggingConfig.printStackTrace }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        // format.simple would be nice to use, but doesn't print a human readable stack trace.
        // write a custom printf that mirrors format.simple, but prints a better stack trace.
        format.printf(({ level, message, stack }) => {
          if (loggingConfig.printStackTrace && stack) {
            return `${level}: ${message} - ${stack}`;
          }
          return `${level}: ${message}`;
        })
      ),
      handleExceptions: true,
    }),
  ],
});
