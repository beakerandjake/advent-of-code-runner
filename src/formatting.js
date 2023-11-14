import {
  differenceInMilliseconds,
  max,
  millisecondsToMinutes,
  millisecondsToSeconds,
  min,
  minutesToMilliseconds,
} from 'date-fns';
import terminalLink from 'terminal-link';

/**
 * Calculates the number of KB the string takes up.
 * @param {String} value - The value whose size to calculate.
 * @param {BufferEncoding} encoding - The strings encoding
 */
export const sizeOfStringInKb = (value, encoding = 'utf-8') => {
  if (value == null) {
    throw new Error('null or undefined value');
  }

  if (value === '') {
    return '0kb';
  }

  return `${(Buffer.byteLength(value, encoding) / 1000).toFixed(2)}kb`;
};

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
 * Given a sorted array, generates a string like 'between $(first) and $(last)'
 * @param {Any[]} choices
 */
export const betweenMessage = (choices = []) => {
  if (choices?.length <= 1) {
    throw new RangeError('Expected an array of at least length 2');
  }

  return `between ${choices[0]} and ${choices[choices.length - 1]}`;
};

/**
 * Makes a url clickable in supported consoles.
 * @param {string} text - The text to display in place of the url.
 * @param {string} url - The url to follow when clicked.
 */
export const makeClickableLink = (text, url) => {
  if (!url) {
    throw new Error('cannot make link from empty url');
  }
  return terminalLink(text, url);
};
