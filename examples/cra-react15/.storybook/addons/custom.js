import React, { useMemo } from 'react';

import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';

export const ADDON_ID = 'storybook/parameter';
export const PANEL_ID = `${ADDON_ID}/panel`;
export const PARAM_KEY = `parameter`;

export const Content = () => {
  const results = useParameter(PARAM_KEY, []);

  return useMemo(
    () =>
      results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null,
    [results]
  );
};

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    title: 'parameter',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
