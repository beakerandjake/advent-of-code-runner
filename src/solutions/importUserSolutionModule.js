/* istanbul ignore file */
import { pathToFileURL } from 'node:url';
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
    // fix ERR_UNSUPPORTED_EM_URL_SCHEME error on windows, and ensure path starts with file://
    const fileUrl = pathToFileURL(fileName).href;
    const module = await import(fileUrl);
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
