/* istanbul ignore file */
import {
  UserSolutionFileNotFoundError,
  UserSolutionSyntaxError,
} from '../errors/solutionWorkerErrors.js';

/**
 * Dynamically imports the users solution file and returns the loaded module
 * (exists only for testability of the worker thread)
 * @param {String} fileName
 * @throws {UserSolutionFileNotFoundError}
 */
export const importUserSolutionModule = async (fileName) => {
  try {
    const module = await import(fileName);
    return module;
  } catch (error) {
    // throw nicer error if user file not found.
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      throw new UserSolutionFileNotFoundError(fileName, { cause: error });
    }

    // throw nicer error if solution file has syntax error.
    if (error instanceof SyntaxError) {
      throw new UserSolutionSyntaxError(error);
    }

    throw error;
  }
};
