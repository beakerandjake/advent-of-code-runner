/**
 * Calculates the number of KB the string takes up.
 * @param {String} value - The value whose size to calculate.
 * @param {BufferEncoding} encoding - The strings encoding
 */
export const sizeOfStringInKb = (value, encoding = 'utf-8') => (Buffer.byteLength(value, encoding) / 1000).toFixed(2);
