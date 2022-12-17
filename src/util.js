/**
 * Returns the value of the object at the specified path.
 * If value is not found default value is returned.
 * Works like lodash get but only supports '.' syntax.
 * @param {Object} target
 * @param {String} path
 * @param {Any} defaultValue
 */
export const get = (target, path, defaultValue = undefined) => {
  const result = String.prototype.split
    .call(path || '', '.')
    .filter(Boolean)
    .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), target);
  return result === undefined || result === target ? defaultValue : result;
};
