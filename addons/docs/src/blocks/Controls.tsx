import React, { FC, useContext } from 'react';
import {
  ArgsTable as PureArgsTable,
  ArgsTableProps as PureArgsTableProps,
  SortType,
  TabbedArgsTable,
} from '@storybook/components';
import { filterArgTypes, PropDescriptor } from '@storybook/store';

import { DocsContext } from './DocsContext';
import { useStory } from './useStory';
import { useArgs, useGlobals } from './hooks';

interface ControlsProps {
  include?: PropDescriptor;
  exclude?: PropDescriptor;
  sort?: SortType;
  of: any;
}

export const Controls: FC<ControlsProps> = (props) => {
  const context = useContext(DocsContext);
  const { of, include, exclude, sort } = props;

  try {
    const storyId = context.storyIdByModuleExport(of);
    const story = useStory(storyId, context);
    // eslint-disable-next-line prefer-const
    let [args, updateArgs, resetArgs] = useArgs(storyId, context);
    const [globals] = useGlobals(storyId, context);
    if (!story) return <PureArgsTable isLoading updateArgs={updateArgs} resetArgs={resetArgs} />;

    const argTypes = filterArgTypes(story.argTypes, include, exclude);

    const tab = { rows: argTypes, args, globals, updateArgs, resetArgs } as PureArgsTableProps;
    const tabs = { Story: tab };
    return <TabbedArgsTable tabs={tabs} sort={sort} />;
  } catch (err) {
    console.log(err);
    return <PureArgsTable error={err.message} />;
  }
};
