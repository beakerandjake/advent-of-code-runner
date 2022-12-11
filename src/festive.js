import boxen from 'boxen';
import chalk from 'chalk';
import Transport from 'winston-transport';
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

const festiveStyle = chalk.bold.hex('#00873E');
const festiveErrorStyle = chalk.red.italic;

/**
 * Turns a normal string into a ~*festive*~ one.
 * @param {String} message
 */
const makeFestive = (message) => (
  getConfigValue('cli.suppressFestive')
    ? message
    : `${sample(festiveEmojis)} ${message} ${sample(festiveEmojis)}`
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

    switch (info.level) {
      case 'festive':
        console.log(makeFestive(festiveStyle(info.message)));
        break;
      case 'festiveError':
        if (info.name === 'SolutionRuntimeError') {
          // Always log the stack trace of user errors.
          console.log(makeFestive(festiveErrorStyle('Your code threw an error!')));
          console.log(festiveErrorStyle(info.message));
        } else {
          console.log(makeFestive(festiveErrorStyle(`${info.stack ? 'Error: ' : ''}${info.message}`)));
        }
        break;
      default:
        break;
    }

    callback();
  }
}
