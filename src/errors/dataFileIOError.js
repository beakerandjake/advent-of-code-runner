import { UserError } from './userError.js';

/**
 * Error that is raised when an issue arises during loading / saving of the user data file.
 */
export class DataFileIOError extends UserError {
  constructor(fileName, ...args) {
    super(`Issue accessing user date file at: "${fileName}". This file should have been created during the "init" command.`, ...args);
    this.name = 'LoadDataFileError';
  }
}
