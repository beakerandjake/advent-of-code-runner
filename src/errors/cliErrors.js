import { UserError } from './userError.js';

/**
 * Error raised if the Solution Worker thread exits without posting an answer message.
 */
export class DirectoryNotInitializedError extends UserError {
  constructor(...args) {
    super("directory not initialized, run 'init' command.", ...args);
    this.name = 'DirectoryNotInitializedError';
  }
}
