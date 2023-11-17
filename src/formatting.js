import {
  differenceInMilliseconds,
  max,
  millisecondsToMinutes,
  millisecondsToSeconds,
  min,
  minutesToMilliseconds,
} from 'date-fns';
import terminalLink from 'terminal-link';
import { puzzleBaseUrl } from './api/urls.js';

/**
 * Calculates the number of KB the string takes up.
 * @param {String} value - The value whose size to calculate.
 * @param {BufferEncoding} encoding - The strings encoding
 */
export const sizeOfStringInKb = (value, encoding = 'utf-8') =>
  value ? `${(Buffer.byteLength(value, encoding) / 1000).toFixed(2)}kb` : '0kb';

/**
 * Converts a duration in nanoseconds to a human readable duration, up to seconds.
 * @param {Number} nanoseconds
 */
export const humanizeDuration = (nanoseconds) => {
  if (nanoseconds == null) {
    return '';
  }

  const seconds = Number(nanoseconds) / (1000 * 1000 * 1000);

  if (seconds >= 1) {
    return `${parseFloat(seconds.toFixed(2))}s`;
  }

  const milliseconds = nanoseconds / (1000 * 1000);

  if (milliseconds >= 1) {
    return `${milliseconds.toFixed(3)}ms`;
  }

  const microseconds = nanoseconds / 1000;

  if (microseconds >= 1) {
    return `${microseconds.toFixed(3)}μs`;
  }

  return `${nanoseconds}ns`;
};

/**
 * Returns a human readable string of the difference in minutes / seconds
 * of the start date to the end date.
 * @param {Date} startDate
 * @param {Date} endDate
 */
export const humanizeMinutesDifference = (startDate, endDate) => {
  const msDifference = differenceInMilliseconds(
    max([startDate, endDate]),
    min([startDate, endDate])
  );

  const minutes = millisecondsToMinutes(msDifference);

  if (minutes >= 1) {
    const remainingSeconds = millisecondsToSeconds(
      msDifference - minutesToMilliseconds(minutes)
    );
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${millisecondsToSeconds(msDifference)}s`;
};

/**
 * Returns a url to the puzzle that is clickable in supported consoles.
 * @param {number} year
 * @param {number} day
 */
export const clickablePuzzleUrl = (year, day) =>
  terminalLink('Puzzle', puzzleBaseUrl(year, day));
