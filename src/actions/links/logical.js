/**
 * Could add any needed logical operators, or even things like ANY, ALL, etc..
 */

/**
 * A logical AND of the two functions.
 * @param {Function} lhs
 * @param {Function} rhs
 * @returns {Promise<Boolean>}
 */
export const and = (lhs, rhs) => {
  const fnName = (lhs?.name && rhs?.name)
    ? `${lhs.name}-and-${rhs.name}`
    : 'and';
  // create a variable for this fn instead of just returning the fn
  // this gives the fn a .name property and makes debugging easier.
  const _ = {
    [fnName]: async (...args) => await lhs(...args) && rhs(...args),
  };
  return _[fnName];
};

/**
 * A logical OR of the two functions.
 * @param {Function} lhs
 * @param {Function} rhs
 * @returns {Promise<Boolean>}
 */
export const or = (lhs, rhs) => {
  const fnName = (lhs?.name && rhs?.name)
    ? `${lhs.name}-or-${rhs.name}`
    : 'or';
  // create a variable for this fn instead of just returning the fn
  // this gives the fn a .name property and makes debugging easier.
  const _ = {
    [fnName]: async (...args) => await lhs(...args) || rhs(...args),
  };
  return _[fnName];
};

/**
 * A logical negation of the function result.
 * @param {Function} fn
 * @returns {Promise<Boolean>}
 */
export const not = (fn) => {
  const fnName = ['not', fn?.name].join('-');
  // create a variable for this fn instead of just returning the fn
  // this gives the fn a .name property and makes debugging easier.
  const _ = {
    [fnName]: async (...args) => !(await fn(...args)),
  };
  return _[fnName];
};
