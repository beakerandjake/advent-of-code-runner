/**
 * Replaces each token on the target string with a matching value from the args object.
 *
 * @param {Object[]} tokens - Array of { match: String, key: String }
 * @param {Object} args - Object whose keys match the keys in the token array.
 * @param {String} target - Target string filled with tokens to replace.
 */
export const replaceTokens = (tokens, args, target) => (
  tokens.reduce((acc, token) => {
    if (!(token.key in args)) {
      throw new Error(`Missing args: ${token.key}`);
    }

    return acc.replace(token.match, args[token.key]);
  }, target)
);
