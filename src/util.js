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
    .reduce(
      (res, key) => (res !== null && res !== undefined ? res[key] : res),
      target
    );
  return result === undefined || result === target ? defaultValue : result;
};

/**
 * Checks to see if the target object contains a property with the given key
 * Works like lodash has but only supports '.' syntax.
 * @param {Object} target
 * @param {String} key
 */
export const has = (target, key) => {
  const keyParts = String.prototype.split.call(key || '', '.');

  return (
    !!target &&
    (keyParts.length > 1
      ? has(target[key.split('.')[0]], keyParts.slice(1).join('.'))
      : hasOwnProperty.call(target, key))
  );
};

/**
 * Returns the type of the value.
 * @param {Any} answer
 * @returns {String}
 */
export const getType = (value) => {
  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (typeof value === 'number') {
    if (Number.isNaN(value)) {
      return 'NaN';
    }
    if (!Number.isFinite(value)) {
      return 'Infinity';
    }
  }

  return value.constructor.name;
};

/**
 * Returns the average of the elements in the array.
 * @param {Number[]} items
 */
export const average = (items = []) =>
  items?.reduce((m, x, i) => m + (x - m) / (i + 1), 0) || NaN;
