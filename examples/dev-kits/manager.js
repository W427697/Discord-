import React from 'react';

import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import { useAddonState } from '@storybook/api';
import { AddonPanel } from '@storybook/components';

addons.setConfig({
  theme: themes.dark,
  panelPosition: 'bottom',
  selectedPanel: 'storybook/roundtrip',
});

addons.addPanel('useAddonState', {
  id: 'useAddonState',
  title: 'useAddonState',
  render: ({ active, key }) => {
    const [state, setState] = useAddonState('test');

    return (
      <AddonPanel key={key} active={active}>
        {state}
      </AddonPanel>
    );
  },
});
