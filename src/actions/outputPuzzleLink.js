import terminalLink from 'terminal-link';
import { puzzleBaseUrl } from '../api/urls.js';
import { logger } from '../logger.js';

/**
 * Outputs a clickable url to the terminal which links to the advent of code puzzle.
 */
export const outputPuzzleLink = ({ year, day, part } = {}) => {
  if (year == null) {
    throw new Error('null or undefined year');
  }

  if (day == null) {
    throw new Error('null or undefined day');
  }

  if (part == null) {
    throw new Error('null or undefined part');
  }

  const clickableLink = terminalLink(
    'Puzzle',
    puzzleBaseUrl(year, day),
  );

  logger.festive(`${clickableLink} (Year: ${year} Day: ${day} Level: ${part}) `);
};
