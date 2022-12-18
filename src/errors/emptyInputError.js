/**
 * Error that is raised when puzzle input is empty.
 */
export class EmptyInputError extends Error {
  constructor() {
    super('Provided puzzle input was empty');
    this.name = 'EmptyInputError';
  }
}
