import { EOL } from 'node:os';
import chalk from 'chalk';
import Transport from 'winston-transport';
import { LEVEL } from 'triple-beam';
import { getConfigValue } from './config.js';

export const festiveStyle = chalk.bold.green;

const festiveEmojis = [
  '🎅', '🤶', '🦌', '🍪', '🥛', '🌟', '❄️ ', '☃️ ', '🌨️ ', '⛄️', '🎄', '🎁', '🛷', '🔔',
];

/**
 * Title box originally created using https://www.npmjs.com/package/boxen
 * I spent too much time making the dang tree..
 */
const festiveTitle = festiveStyle([
  '┌ 🎅 advent-of-code-runner 🤶 ┐',
  '│                             │',
  '│              🌟             │',
  '│              🎄             │',
  '│             🎄🎄            │',
  '│            🎄🎄🎄           │',
  '│           🎄🎄🎄🎄          │',
  '│             🎁🎁            │',
  '│                             │',
  '└─────────────────────────────┘',
].join(EOL));

/**
 * Prints the title box to the console, unless configured to suppress.
 */
export const printFestiveTitle = () => {
  if (getConfigValue('cli.suppressTitleBox')) {
    return;
  }
  // use console log instead of logger for direct output.
  console.log(festiveTitle);
};

/**
 * Returns a random *festive* emoji.
 */
export const festiveEmoji = () => festiveEmojis[Math.floor(Math.random() * festiveEmojis.length)];

/**
 * Turns a normal string into a *festive* one.
 * @param {String} message
 */
const makeFestive = (message) => (
  getConfigValue('cli.suppressFestive')
    ? message
    : `${festiveEmoji()} ${message} ${festiveEmoji()}`
);

/**
 * Special winston Transport that creates festive console logs.
 */
export class FestiveTransport extends Transport {
  constructor(options) {
    super(options);
    this.name = options.name || 'festive';
  }

  log(info, callback) {
    setImmediate(() => this.emit('logged', info));

    if (info[LEVEL] === 'festive') {
      console.log(makeFestive(festiveStyle(info.message)));
    }

    callback();
  }
}
