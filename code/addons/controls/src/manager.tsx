import React from 'react';
import { addons, types, useArgTypes } from '@storybook/manager-api';
import { AddonPanel, Badge, Spaced } from '@storybook/components';
import { ControlsPanel } from './ControlsPanel';
import { SaveButton } from './SaveButton';
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
    type: types.PANEL,
    paramKey: PARAM_KEY,
    render: ({ active }) => {
      if (!active || !api.getCurrentStoryData()) {
        return null;
      }
      return (
        <AddonPanel active={active}>
          <ControlsPanel />
        </AddonPanel>
      );
    },
  });

  addons.add(ADDON_ID, {
    title: 'Save controls',
    type: types.TOOL,
    match: ({ viewMode, tabId }) => viewMode === 'story' && !tabId,
    render: () => <SaveButton />,
  });
});
