import emoji from 'node-emoji';
import boxen from 'boxen';
import { config } from 'dotenv';
import { getConfigValue } from '../config.js';

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

const christmasTree = `
        🌟        
        🎄        
       🎄🎄       
      🎄🎄🎄      
     🎄🎄🎄🎄     
       🎁🎁       
`;

const titleBox = boxen(christmasTree, {
  borderColor: 'green',
  title: `${emojiMap.santa} ${getConfigValue('meta.name')} ${emojiMap.mrsClaus}`,
  textAlignment: 'center',
  titleAlignment: 'center',
});

export const printTitleBox = () => {
  if (getConfigValue('cli.suppressTitleBox')) {
    return;
  }

  console.log(titleBox);
};
