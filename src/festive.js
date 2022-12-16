import boxen from 'boxen';
import chalk from 'chalk';
import Transport from 'winston-transport';
import { LEVEL } from 'triple-beam';
import { sample } from 'lodash-es';
import { getConfigValue } from './config.js';

const santa = '🎅';
const mrsClaus = '🤶';

const festiveEmojis = [
  santa, mrsClaus, '🦌', '🍪', '🥛', '🌟', '❄️ ', '☃️ ', '🌨️ ', '⛄️', '🎄', '🎁', '🛷', '🔔',
];

/**
 * I spent too much time making this dang tree.
 */
const christmasTree = `
          🌟        
          🎄        
         🎄🎄       
        🎄🎄🎄      
       🎄🎄🎄🎄     
         🎁🎁       
  `;

/**
 * A nice title box surrounding the christmas tree
 */
const festiveTitle = boxen(christmasTree, {
  borderColor: 'green',
  title: `${santa} ${getConfigValue('meta.name')} ${mrsClaus}`,
  textAlignment: 'center',
  titleAlignment: 'center',
});

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
 * Returns a random ~*festive*~ emoji.
 */
export const festiveEmoji = () => sample(festiveEmojis);

export const festiveStyle = chalk.bold.green;
/**
 * Turns a normal string into a ~*festive*~ one.
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
