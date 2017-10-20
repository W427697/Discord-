import { configure, setAddon } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import infoAddon from '@storybook/addon-info';

setOptions({
  name: 'CRA Kitchen Sink',
  url: 'https://github.com/storybooks/storybook/tree/master/examples/cra-kitchen-sink',
  goFullScreen: false,
  // showStoriesPanel: true,
  // showAddonsPanel: true,
  // showSearchBox: false,
  // addonsPanelInRight: true,
  sortStoriesByKind: false,
  hierarchySeparator: /\/|\./,
  layout: {
    direction: 'row',
    items: [
      {
        size: 300,
        resize: 'fixed',
        component: 'addonTabs',
        props: {
          selected: 'action',
        },
      },
      {
        size: 800,
        minSize: 400,
        resize: 'stretch',
        component: 'preview',
        props: {
          primary: true,
        },
      },
      {
        size: 100,
        minSize: 100,
        resize: 'stretch',
        component: 'preview',
      },
      {
        size: 300,
        resize: 'dynamic',
        component: 'explorer',
      },
    ],
  },
});

setAddon(infoAddon);

function loadStories() {
  require('../src/stories/index');
  require('../src/stories/storybook-components');
}

configure(loadStories, module);
