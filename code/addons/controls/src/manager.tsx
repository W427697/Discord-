import React from 'react';
import { addons, types, type API, useArgTypes, useParameter } from '@storybook/manager-api';
import { AddonPanel } from '@storybook/components';
import { ControlsPanel } from './ControlsPanel';
import { ADDON_ID, PARAM_KEY } from './constants';
import type { ControlsParameters } from './controls-parameters';

addons.register(ADDON_ID, (api: API) => {
  addons.addPanel(ADDON_ID, {
    title() {
      const { visibleCategories } = useParameter<ControlsParameters>(PARAM_KEY, {});

      const rows = useArgTypes();
      const controlsCount = Object.values(rows).filter(
        (argType) =>
          argType?.control &&
          (!visibleCategories ||
            (visibleCategories && visibleCategories.includes(argType.table?.category)))
      ).length;

      const suffix = controlsCount === 0 ? '' : ` (${controlsCount})`;
      return `Controls${suffix}`;
    },
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
