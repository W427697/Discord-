import React from 'react';
import { addons } from '@storybook/addons';
import { Addon_TypesEnum } from '@storybook/types';

import { StoryPanel } from './StoryPanel';
import { ADDON_ID, PANEL_ID } from './index';

addons.register(ADDON_ID, (api) => {
  addons.addPanel(PANEL_ID, {
    title: 'Story',
    type: Addon_TypesEnum.PANEL,
    render: ({ active, key }) => (active ? <StoryPanel key={key} api={api} /> : null),
    paramKey: 'storysource',
  });
});
