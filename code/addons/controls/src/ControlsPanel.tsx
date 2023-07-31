import type { FC } from 'react';
import React, { useEffect } from 'react';
import {
  useArgs,
  useGlobals,
  useArgTypes,
  useParameter,
  useStorybookState,
  useChannel,
} from '@storybook/manager-api';
import { STORY_CHANGED, STORY_PREPARED } from '@storybook/core-events';
import { PureArgsTable as ArgsTable, type PresetColor, type SortType } from '@storybook/blocks';

import type { ArgTypes } from '@storybook/types';
import { set } from 'lodash';
import { PARAM_KEY } from './constants';

interface ControlsParameters {
  sort?: SortType;
  expanded?: boolean;
  presetColors?: PresetColor[];
  hideNoControlsWarning?: boolean;
}

export const ControlsPanel: FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [args, updateArgs, resetArgs] = useArgs();
  const [globals] = useGlobals();
  const rows = useArgTypes();
  const isArgsStory = useParameter<boolean>('__isArgsStory', false);
  const { expanded, sort, presetColors } = useParameter<ControlsParameters>(PARAM_KEY, {});
  const { path } = useStorybookState();

  // If the story is prepared, then show the args table
  useChannel({
    [STORY_PREPARED]: () => setIsLoading(false),
  });

  // If the story changes, then show the loading state
  useEffect(() => {
    setIsLoading(true);
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
    />
  );
};

// storiesOf("Button").add("Basic0", () => <Button label="The Button" />);
// export const Basic1 = () => <Button label="The Button" />;

// export const AllButtons = () => <>....</>;

// export const Basic2 = (args) => <Button {...args} />;
// Basic2.args = { label: "The Button" };
// export const Basic3 = { args: { label: "The Button" } }
