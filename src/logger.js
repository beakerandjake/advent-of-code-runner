import { createLogger, format, transports } from 'winston';

const printStackTrace = process.env.NODE_ENV !== 'production';

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.errors({ stack: printStackTrace }),
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
          if (printStackTrace && stack) {
            return `${level}: ${message} - ${stack}`;
          }
          return `${level}: ${message}`;
        })
      ),
      handleExceptions: true,
    }),
  ],
});
