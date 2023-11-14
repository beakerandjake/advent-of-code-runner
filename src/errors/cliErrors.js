import { UserError } from './userError.js';

/**
 * Error raised if users directory is not initialized.
 */
export class DirectoryNotInitializedError extends UserError {
  constructor(...args) {
    super('directory not initialized, run init command.', ...args);
    this.name = 'DirectoryNotInitializedError';
  }
}

/**
 * Error raised if required file is not found in users directory.
 */
export class FileNotFoundError extends UserError {
  constructor(file, ...args) {
    super(`could not find file: ${file} in project directory.`, ...args);
    this.name = 'DirectoryNotInitializedError';
  }
}
