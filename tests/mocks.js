import { jest } from '@jest/globals';

/**
 * Mocks the logging module and all of the common log functions.
 */
export const mockLogger = () => {
  const toReturn = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    verbose: jest.fn(),
    debug: jest.fn(),
    silly: jest.fn(),
    festive: jest.fn(),
    log: jest.fn(),
  };
  jest.unstable_mockModule('src/logger.js', () => ({
    logger: toReturn,
  }));

  return toReturn;
};

/**
 * Mocks the config module and all of the commonly used functions.
 */
export const mockConfig = () => {
  const toReturn = {
    getConfigValue: jest.fn(),
    envOptions: {},
  };
  jest.unstable_mockModule('src/config.js', () => toReturn);
  return toReturn;
};

/**
 * Sets up mocks for all of the modules
 */
export const easyMock = (modules) => {
  for (const [name, fields] of modules) {
    jest.unstable_mockModule(name, () =>
      fields.reduce((acc, field) => {
        if (Array.isArray(field)) {
          // can use an array to provide a value
          const [key, value] = field;
          acc[key] = value;
        } else {
          // simple string means just use a jest.fn
          acc[field] = jest.fn();
        }
        return acc;
      }, {})
    );
  }
};

export const easyResolve = async (modules) => {
  const imports = await Promise.all(
    modules.map(([name]) =>
      name.startsWith('src/') ? import(`../${name}`) : import(name)
    )
  );
  return imports.reduce((acc, x, i) => {
    for (const field of modules[i][1]) {
      const key = Array.isArray(field) ? field[0] : field;
      if (key === 'default') {
        // if mocking a default export then assign to the field name.
        acc[modules[i][0]] = x[key];
      } else {
        acc[key] = x[key];
      }
    }
    return acc;
  }, {});
};
