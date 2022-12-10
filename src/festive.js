import emoji from 'node-emoji';
import boxen from 'boxen';
import chalk from 'chalk';
import Transport from 'winston-transport';
import { sample, values } from 'lodash-es';
import { getConfigValue } from './config.js';

const emojiMap = {
  santa: emoji.get('santa'),
  mrsClaus: emoji.get('mrs_claus'),
  deer: emoji.get('deer'),
  cookie: emoji.get('cookie'),
  milk: emoji.get('glass_of_milk'),
  star: emoji.get('star2'),
  snowflake: emoji.get('snowflake'),
  snowing: emoji.get('snow_cloud'),
  snowman: emoji.get('snowman_without_snow'),
  christmasTree: emoji.get('christmas_tree'),
  present: emoji.get('gift'),
  sled: emoji.get('sled'),
  bell: emoji.get('bell'),
};

const emojis = values(emojiMap);

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
  title: `${emojiMap.santa} ${getConfigValue('meta.name')} ${emojiMap.mrsClaus}`,
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
    : festiveStyle(`${sample(emojis)} ${message} ${sample(emojis)}`)
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
