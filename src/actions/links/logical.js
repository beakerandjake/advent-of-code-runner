/**
 * Could add any needed logical operators, or even things like ANY, ALL, etc..
 */

/**
 * A logical OR of the two functions.
 * @param {Function} lhs
 * @param {Function} rhs
 * @returns {Promise<Boolean>}
 */
export const or = (lhs, rhs) => async (...args) => lhs(...args) || rhs(...args);

/**
 * A logical negation of the function result.
 * @param {Function} fn
 * @returns {Promise<Boolean>}
 */
export const not = (fn) => async (...args) => !fn(...args);
