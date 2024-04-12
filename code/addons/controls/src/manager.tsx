import React from 'react';
import { addons, types, useArgTypes } from '@storybook/manager-api';
import { AddonPanel, Badge, Spaced } from '@storybook/components';
import { ControlsPanel } from './ControlsPanel';
import { ADDON_ID, PARAM_KEY } from './constants';
import { AlertIcon, CheckIcon } from '@storybook/icons';
import { SAVE_STORY_RESULT } from '@storybook/core-events';

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

  api.on(SAVE_STORY_RESULT, (data) => {
    if (data.error) {
      api.addNotification({
        content: { headline: `Error saving story`, subHeadline: ` ${data.error}` },
        id: 'save-story-error',
        icon: <AlertIcon />,
      });
    } else {
      api.addNotification({
        content: { headline: `Story saved`, subHeadline: ` ${data.id}` },
        duration: 2000,
        icon: <CheckIcon />,
        id: 'save-story-success',
      });
    }
  });
});
