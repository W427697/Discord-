import * as React from 'react';
import { addons } from '@storybook/addons';
import { Addon_TypesEnum } from '@storybook/types';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './shared';

import Panel from './components/Panel';

addons.register(ADDON_ID, (api) => {
  addons.addPanel(PANEL_ID, {
    title: 'Tests',
    type: Addon_TypesEnum.PANEL,
    render: ({ active, key }) => <Panel key={key} api={api} active={active} />,
    paramKey: PARAM_KEY,
  });
});
