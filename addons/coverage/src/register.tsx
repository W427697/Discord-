import React from 'react';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';

import { CoverageTool } from './CoverageTool';
import { CoveragePanel } from './CoveragePanel';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './shared';

addons.register(ADDON_ID, api => {
  addons.add(PANEL_ID, {
    type: types.TOOL,
    title: 'Coverage',
    match: ({ viewMode }) => viewMode === 'story', // todo add type
    render: () => <CoverageTool />,
  });

  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Coverage',
    match: ({ viewMode }) => viewMode === 'story', // todo add type
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <CoveragePanel />
      </AddonPanel>
    ),
    paramKey: PARAM_KEY,
  });
});
