/**
 * Calculates the number of KB the string takes up.
 * @param {String} value - The value whose size to calculate.
 * @param {BufferEncoding} encoding - The strings encoding
 */
export const sizeOfStringInKb = (value, encoding = 'utf-8') => (Buffer.byteLength(value, encoding) / 1000).toFixed(2);

/**
 * Converts a duration in nanoseconds to a human readable duration, up to seconds.
 * @param {Number} nanoseconds
 */
export const humanizeDuration = (nanoseconds) => {
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
