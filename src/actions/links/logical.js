/**
 * Could add any needed logical operators, or even things like ANY, ALL, etc..
 */

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
  /**
   * creating object and returning its function instead of the arrow function directly
   * this is a hack to ensure that we get a .name property on the returned function.
   * if we just returned arrow fn it wouldn't have a .name, that makes debugging the chain hard.
   */
  const toReturn = {
    [fnName]: async (...args) => lhs(...args) || rhs(...args),
  };
  return toReturn[fnName];
};

/**
 * A logical negation of the function result.
 * @param {Function} fn
 * @returns {Promise<Boolean>}
 */
export const not = (fn) => {
  const fnName = ['not', fn?.name].join('-');
  /**
   * creating object and returning its function instead of the arrow function directly
   * this is a hack to ensure that we get a .name property on the returned function.
   * if we just returned arrow fn it wouldn't have a .name, that makes debugging the chain hard.
   */
  const toReturn = {
    [fnName]: async (...args) => !(await fn(...args)),
  };
  return toReturn[fnName];
};
