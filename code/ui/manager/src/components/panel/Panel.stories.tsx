import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import type { Addon_Collection } from '@storybook/types';
import { AddonPanel as Panel } from './Panel';
import { defaultShortcuts } from '../../settings/defaultShortcuts';

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
  component: Panel,
};

export const Default = () => {
  const [selectedPanel, setSelectedPanel] = useState('test2');
  return (
    <Panel
      absolute={false}
      panels={panels}
      actions={{ onSelect: setSelectedPanel, toggleVisibility, togglePosition }}
      selectedPanel={selectedPanel}
      shortcuts={defaultShortcuts}
    />
  );
};

export const NoPanels = () => (
  <Panel
    panels={{}}
    actions={{ onSelect, toggleVisibility, togglePosition }}
    shortcuts={defaultShortcuts}
  />
);
