import { UserError } from './userError.js';

/**
 * Error that is raised when translating stored user data fails
 */
export class UserDataTranslationError extends UserError {
  constructor(message) {
    super(`Translating data failed: ${message}`);
    this.name = 'UserDataTranslationError';
  }
}
