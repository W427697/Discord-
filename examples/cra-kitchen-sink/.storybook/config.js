import { configure, setAddon } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import infoAddon from '@storybook/addon-info';
import getAddons from './addon-composition';

setOptions({
  name: 'CRA Kitchen Sink',
  url: 'https://github.com/storybooks/storybook/tree/master/examples/cra-kitchen-sink',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  showSearchBox: false,
  downPanelInRight: true,
  sortStoriesByKind: false,
  hierarchySeparator: '\\/|\\.|¯\\\\_\\(ツ\\)_\\/¯'
});

setAddon(infoAddon);
setAddon(getAddons);

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
