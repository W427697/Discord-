import React from 'react';
import { addons, types } from '@storybook/addons';

import { Coverage } from './Coverage';
import { ADDON_ID, PANEL_ID, setCoverage } from './shared';

//FIXME: move to config.js
import coverageMap from '/Users/shilman/projects/storybookjs/storybook/coverage/coverage-final.json';
setCoverage(coverageMap);

addons.register(ADDON_ID, api => {
  addons.add(PANEL_ID, {
    type: types.TOOL,
    title: 'Coverage',
    match: ({ viewMode }) => viewMode === 'story', // todo add type
    render: () => <Coverage />,
  });
});
