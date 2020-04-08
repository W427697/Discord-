import React from 'react';
import { addons, types } from '@storybook/addons';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';
import { ColorBlindness } from './components/ColorBlindness';
import A11YPanel from './components/A11YPanel';
import { A11yContextProvider } from './components/A11yContext';
import { PreviewWrapper } from './PreviewWrapper';

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    title: '',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <ColorBlindness />,
  });

  addons.add(PANEL_ID, {
    title: 'Accessibility',
    type: types.PANEL,
    render: ({ active = true, key }) => (
      <A11yContextProvider key={key}>
        <A11YPanel active={active} />
      </A11yContextProvider>
    ),
    paramKey: PARAM_KEY,
  });

  addons.add(PANEL_ID, {
    title: '',
    type: types.PREVIEW,
    render: PreviewWrapper as any,
  });
});
