import React from 'react';
import { addons, types, useArgTypes } from '@storybook/manager-api';
import { AddonPanel, Badge, Spaced } from '@storybook/components';
import { ControlsPanel } from './ControlsPanel';
import { ADDON_ID, PARAM_KEY } from './constants';

function Title() {
  const rows = useArgTypes();
  const controlsCount = Object.values(rows).filter(
    (argType) => argType?.control && !argType?.table?.disable
  ).length;
  const suffix = controlsCount === 0 ? '' : <Badge status="neutral">{controlsCount}</Badge>;

  return (
    <div>
      <Spaced col={1}>
        <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>Controls</span>
        {suffix}
      </Spaced>
    </div>
  );
}

addons.register(ADDON_ID, (api) => {
  addons.add(ADDON_ID, {
    title: Title,
    id: 'controls',
    type: types.PANEL,
    paramKey: PARAM_KEY,
    render: ({ key, active }) => {
      if (!active || !api.getCurrentStoryData()) {
        return null;
      }
      return (
        <AddonPanel key={key} active={active}>
          <ControlsPanel />
        </AddonPanel>
      );
    },
  });
});
