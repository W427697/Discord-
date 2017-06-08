import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

setOptions({
  name: 'Test-CRA',
  url: 'https://github.com/storybooks/storybook/tree/master/examples/test-cra',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  showSearchBox: false,
  downPanelInRight: true,
  sortStoriesByKind: false,
})

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
