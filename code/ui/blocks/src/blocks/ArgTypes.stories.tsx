import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ArgTypes } from './ArgTypes';
import * as ButtonStories from '../examples/Button.stories';

const meta: Meta<typeof ArgTypes> = {
  title: 'Blocks/ArgTypes',
  component: ArgTypes,
  parameters: {
    relativeCsfPaths: ['../examples/Button.stories', '../blocks/ArgTypes.stories'],
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OfComponent: Story = {
  args: {
    of: ButtonStories.default.component,
  },
};

export const OfMeta: Story = {
  args: {
    of: ButtonStories.default,
  },
};

export const OfStory: Story = {
  args: {
    of: ButtonStories.Primary,
  },
};

// NOTE: this will throw with no of prop
export const OfStoryUnattached: Story = {
  parameters: { attached: false },
  args: {
    of: ButtonStories.Primary,
  },
};

export const Simple = {
  render: () => <div>Story for reference</div>,
  argTypes: {
    a: { type: { name: 'string' }, name: 'A', description: 'a' },
    b: { type: { name: 'string', required: true }, name: 'B', description: 'b' },
  },
};

export const IncludeProp: Story = {
  args: {
    of: Simple,
    include: ['A'],
  },
};

export const SimpleInclude = {
  ...Simple,
  parameters: { docs: { argTypes: { include: ['A'] } } },
};

export const IncludeParameter: Story = {
  args: {
    of: SimpleInclude,
  },
};

export const ExcludeProp: Story = {
  args: {
    of: Simple,
    exclude: ['A'],
  },
};

export const SimpleExclude = {
  ...Simple,
  parameters: { docs: { argTypes: { exclude: ['A'] } } },
};

export const ExcludeParameter: Story = {
  args: {
    of: SimpleExclude,
  },
};

export const SortProp: Story = {
  args: {
    of: Simple,
    sort: 'requiredFirst',
  },
};

export const SimpleSort = {
  ...Simple,
  parameters: { docs: { argTypes: { sort: 'requiredFirst' } } },
};

export const SortParameter: Story = {
  args: {
    of: SimpleSort,
  },
};
