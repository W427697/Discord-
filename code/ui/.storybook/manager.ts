import { addons } from '@storybook/manager-api';
import startCase from 'lodash/startCase.js';

addons.setConfig({
  sidebar: {
    renderLabel: ({ name, type }) => (type === 'story' ? name : startCase(name)),
  },
});

console.log(process.env.STORYBOOK_FOO);
console.log(process.env);
