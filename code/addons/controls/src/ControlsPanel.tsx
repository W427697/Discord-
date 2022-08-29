import React, { FC } from 'react';
import {
  ArgTypes,
  useArgs,
  useGlobals,
  useArgTypes,
  useParameter,
  useStorybookState,
} from '@storybook/api';
import { PureArgsTable as ArgsTable, PresetColor, SortType } from '@storybook/blocks';

import { PARAM_KEY } from './constants';

interface ControlsParameters {
  sort?: SortType;
  expanded?: boolean;
  presetColors?: PresetColor[];
}

export const ControlsPanel: FC = () => {
  const [args, updateArgs, resetArgs] = useArgs();
  const [globals] = useGlobals();
  const rows = useArgTypes();
  const { expanded, sort, presetColors } = useParameter<ControlsParameters>(PARAM_KEY, {});
  const { path } = useStorybookState();

  const hasControls = Object.values(rows).some((arg) => arg?.control);

  const withPresetColors = Object.entries(rows).reduce((acc, [key, arg]) => {
    if (arg?.control?.type !== 'color' || arg?.control?.presetColors) acc[key] = arg;
    else acc[key] = { ...arg, control: { ...arg.control, presetColors } };
    return acc;
  }, {} as ArgTypes);

  return (
    <>
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
      />
    </>
  );
};
