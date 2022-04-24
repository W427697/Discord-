import React from 'react';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
import { API } from '@storybook/api';
import { SourcePanel } from './SourcePanel';
import { ADDON_ID, PARAM_KEY } from './constants';

addons.register(ADDON_ID, (api: API) => {
  addons.addPanel(ADDON_ID, {
    title: 'Source',
    type: types.PANEL,
    paramKey: PARAM_KEY,
    render: ({ key, active }) => {
      return (
        // always render the addon panel so it can listen to the channel
        // even when the source panel is not active
        <AddonPanel key={key} active={active}>
          <SourcePanel />
        </AddonPanel>
      );
    },
  });
});
