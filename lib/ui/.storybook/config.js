import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

setOptions({
  name: {
    short: 'IED',
    full: 'In Extenso Digital',
  },
  url: 'http://www.inextenso.digital/',
  showAddonPanel: false,
  hierarchyRootSeparator: /\|/,
});

function loadStories() {
  require('../stories/index.js');
}

configure(loadStories, module);
