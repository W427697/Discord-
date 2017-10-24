import React from 'react';
import { configure, setAddon } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import infoAddon from '@storybook/addon-info';

setOptions({
  name: 'CRA Kitchen Sink',
  url: 'https://github.com/storybooks/storybook/tree/master/examples/cra-kitchen-sink',
  goFullScreen: false,
  showStoriesPanel: true,
  showAddonsPanel: true,
  showSearchBox: false,
  addonsPanelInRight: true,
  sortStoriesByKind: false,
  hierarchySeparator: /\/|\./,
});

setAddon(infoAddon);

setAddon({
  _initBackground() {
    this.add('Toc',() => <div> Info about <b>{this.kind}:</b> it's just a very simple example!</div>)
  }
})

function loadStories() {
  require('../src/stories/index');
  require('../src/stories/storybook-components');
}

configure(loadStories, module);
