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

/**
 * Error raised if the auth token could not be loaded.
 */
export class AuthTokenNotFoundError extends UserError {
  constructor(...args) {
    super(
      'Could not get authentication token from .env file, you can add the auth token using the "auth" command.',
      ...args
    );
    this.name = 'AuthTokenNotFoundError';
  }
}
