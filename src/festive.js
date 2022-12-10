import boxen from 'boxen';
import chalk from 'chalk';
import Transport from 'winston-transport';
import { sample } from 'lodash-es';
import { getConfigValue } from './config.js';

const santa = '🎅';
const mrsClaus = '🤶';

const festiveEmojis = [
  santa, mrsClaus, '🦌', '🍪', '🥛', '🌟', '❄️', '☃️', '🌨️', '⛄️', '🎄', '🎁', '🛷', '🔔',
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

const festiveStyle = chalk.bold.hex('#00873E');

/**
 * Turns a normal string into a ~*festive*~ one.
 * @param {String} message
 */
const makeFestive = (message) => (
  getConfigValue('cli.suppressFestive')
    ? message
    : festiveStyle(`${sample(festiveEmojis)}\uFE0F${message} ${sample(festiveEmojis)}`)
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

    // transport only cares about festive messages
    // and ignores all others.
    if (info.level === 'festive') {
      console.log(makeFestive(info.message));
    }

    callback();
  }
}
