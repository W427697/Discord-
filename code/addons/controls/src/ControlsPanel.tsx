import type { FC } from 'react';
import React from 'react';
import {
  useArgs,
  useGlobals,
  useArgTypes,
  useParameter,
  useStorybookState,
} from '@storybook/manager-api';
import { PureArgsTable as ArgsTable, type PresetColor, type SortType } from '@storybook/blocks';

import type { ArgTypes } from '@storybook/types';
import { PARAM_KEY } from './constants';

interface ControlsParameters {
  sort?: SortType;
  expanded?: boolean;
  presetColors?: PresetColor[];
  hideNoControlsWarning?: boolean;
}

export const ControlsPanel: FC = () => {
  const [args, updateArgs, resetArgs] = useArgs();
  const [globals] = useGlobals();
  const rows = useArgTypes();
  const isArgsStory = useParameter<boolean>('__isArgsStory', false);
  const isLoading = !isArgsStory;
  const { expanded, sort, presetColors } = useParameter<ControlsParameters>(PARAM_KEY, {});
  const { path } = useStorybookState();

  const hasControls = Object.values(rows).some((arg) => arg?.control);

  const withPresetColors = Object.entries(rows).reduce((acc, [key, arg]) => {
    if (arg?.control?.type !== 'color' || arg?.control?.presetColors) acc[key] = arg;
    else acc[key] = { ...arg, control: { ...arg.control, presetColors } };
    return acc;
  }, {} as ArgTypes);

  console.log('isLoading in ControlsPanel', isLoading);

  return (
    <ArgsTable
      {...{
        key: path, // resets state when switching stories
        compact: !expanded && hasControls,
        rows: withPresetColors,
        args,
        globals,
        updateArgs,
        resetArgs,
        inAddonPanel: true,
        sort,
      }}
      isLoading={isLoading}
    />
  );
};
