import { UserSolutionFileNotFoundError } from '../errors/solutionWorkerErrors.js';

/**
 * Dynamically imports the users solution file and returns the loaded module
 * (exists only for testability of the worker thread)
 * @param {String} fileName
 * @throws {UserSolutionFileNotFoundError}
 */
export const importUserSolutionFile = async (fileName) => {
  try {
    const module = await import(fileName);
    return module;
  } catch (error) {
    throw new UserSolutionFileNotFoundError(fileName, { cause: error });
  }
};
