import global from 'global';
import path from 'path';
import initStoryshots from '@storybook/addon-storyshots';

console.log('init ss');
console.log(global.FEATURES?.storyStoreV7);
initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
});
console.log('init ss done');
