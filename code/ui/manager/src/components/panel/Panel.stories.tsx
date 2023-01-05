import React from 'react';
import { action } from '@storybook/addon-actions';
import type { State } from '@storybook/manager-api';
import type { Addon_Collection } from '@storybook/types';
import { AddonPanel } from './Panel';

const shortcuts: State['shortcuts'] = {
  fullScreen: ['F'],
  togglePanel: ['A'],
  panelPosition: ['D'],
  toggleNav: ['S'],
  toolbar: ['T'],
  search: ['/'],
  focusNav: ['1'],
  focusIframe: ['2'],
  focusPanel: ['3'],
  prevComponent: ['alt', 'ArrowUp'],
  nextComponent: ['alt', 'ArrowDown'],
  prevStory: ['alt', 'ArrowLeft'],
  nextStory: ['alt', 'ArrowRight'],
  shortcutsPage: ['ctrl', 'shift', ','],
  aboutPage: [','],
  escape: ['escape'],
  collapseAll: ['ctrl', 'shift', 'ArrowUp'],
  expandAll: ['ctrl', 'shift', 'ArrowDown'],
};

const panels: Addon_Collection = {
  test1: {
    title: 'Test 1',
    render: ({ active, key }) =>
      active ? (
        <div id="test1" key={key}>
          TEST 1
        </div>
      ) : null,
  },
  test2: {
    title: 'Test 2',
    render: ({ active, key }) =>
      active ? (
        <div id="test2" key={key}>
          TEST 2
        </div>
      ) : null,
  },
};
const onSelect = action('onSelect');
const toggleVisibility = action('toggleVisibility');
const togglePosition = action('togglePosition');

export default {
  title: 'Panel',
  component: AddonPanel,
};

export const Default = () => (
  <AddonPanel
    absolute={false}
    panels={panels}
    actions={{ onSelect, toggleVisibility, togglePosition }}
    selectedPanel="test2"
    shortcuts={shortcuts}
  />
);

export const NoPanels = () => (
  <AddonPanel
    panels={{}}
    actions={{ onSelect, toggleVisibility, togglePosition }}
    shortcuts={shortcuts}
  />
);
