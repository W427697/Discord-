import React from 'react';
import { addons, types } from '@storybook/manager-api';
import { Badge, Spaced } from '@storybook/components';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';
import { VisionSimulator } from './components/VisionSimulator';
import { A11YPanel } from './components/A11YPanel';
import type { Results } from './components/A11yContext';
import { A11yContextProvider } from './components/A11yContext';

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    title: '',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <VisionSimulator />,
  });

  addons.add(PANEL_ID, {
    title() {
      const addonState: Results = api?.getAddonState(ADDON_ID);
      const violationsNb = addonState?.violations?.length || 0;
      const incompleteNb = addonState?.incomplete?.length || 0;
      const count = violationsNb + incompleteNb;

      const suffix = count === 0 ? '' : <Badge status="neutral">{count}</Badge>;

      return (
        <div>
          <Spaced col={1}>
            <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>Accessibility</span>
            {suffix}
          </Spaced>
        </div>
      );
    },
    type: types.PANEL,
    render: ({ active = true, key }) => (
      <A11yContextProvider key={key} active={active}>
        <A11YPanel />
      </A11yContextProvider>
    ),
    paramKey: PARAM_KEY,
  });
});
