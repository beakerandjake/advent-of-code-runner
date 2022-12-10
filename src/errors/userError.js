/**
 * Base Error class which denotes that the error is a 'normal', 'expected' error.
 * A normal error is something like the user exceeding the rate limit or
 * attempting to solve a puzzle they already solved.
 *
 * Errors which derive from this class will be presented to the user with a special
 * format as opposed to Errors which don't derive from this which are more 'unexpected'
 * errors such as file permissions or networking errors.
 */
export class UserError extends Error {}
