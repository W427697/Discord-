import React from 'react';

import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import { useAddonState } from '@storybook/api';
import { AddonPanel } from '@storybook/components';

import '@storybook/addon-roundtrip/register';
import '@storybook/addon-parameter/register';

addons.setConfig({
  theme: themes.dark,
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
