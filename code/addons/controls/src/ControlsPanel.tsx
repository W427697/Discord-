import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import {
  useArgs,
  useGlobals,
  useArgTypes,
  useParameter,
  useStorybookState,
  useChannel,
} from '@storybook/manager-api';
import { STORY_PREPARED } from '@storybook/core-events';
import { PureArgsTable as ArgsTable, type PresetColor, type SortType } from '@storybook/blocks';

import type { ArgTypes } from '@storybook/types';
import { PARAM_KEY } from './constants';

interface ControlsParameters {
  sort?: SortType;
  expanded?: boolean;
  presetColors?: PresetColor[];

  /** @deprecated No longer used, will be removed in Storybook 8.0 */
  hideNoControlsWarning?: boolean;
}

export const ControlsPanel: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSoftLoading, setIsSoftLoading] = useState(true);
  const [args, updateArgs, resetArgs] = useArgs();
  const [globals] = useGlobals();
  const rows = useArgTypes();
  const { expanded, sort, presetColors } = useParameter<ControlsParameters>(PARAM_KEY, {});
  const { path } = useStorybookState();

  // If the story is prepared, then show the args table
  // and reset the loading states
  useChannel({
    [STORY_PREPARED]: () => {
      setIsLoading(false);
      setIsSoftLoading(false);
    },
  });

  // If the story changes, then show the loading state
  useEffect(() => {
    setIsSoftLoading(true);
  }, [path]);

  const hasControls = Object.values(rows).some((arg) => arg?.control);

  const withPresetColors = Object.entries(rows).reduce((acc, [key, arg]) => {
    if (arg?.control?.type !== 'color' || arg?.control?.presetColors) acc[key] = arg;
    else acc[key] = { ...arg, control: { ...arg.control, presetColors } };
    return acc;
  }, {} as ArgTypes);

  return (
    <ArgsTable
      key={path} // resets state when switching stories
      compact={!expanded && hasControls}
      rows={withPresetColors}
      args={args}
      globals={globals}
      updateArgs={updateArgs}
      resetArgs={resetArgs}
      inAddonPanel
      sort={sort}
      isLoading={isLoading}
      isSoftLoading={isSoftLoading}
    />
  );
};
