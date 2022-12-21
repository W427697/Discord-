import type { Meta, StoryObj } from '@storybook/react';
import { Description } from './Description';
import { BooleanControl } from '../controls/Boolean';

const meta: Meta<typeof Description> = {
  component: Description,
  parameters: {
    relativeCsfPaths: ['../controls/Boolean.stories'],
    controls: {
      include: [],
      hideNoControlsWarning: true,
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PrimaryStory: Story = {
  args: {
    of: '^',
  },
};

export const BooleanControlJSDoc: Story = {
  args: {
    of: BooleanControl,
  },
};

export const OfUnattached: Story = {
  args: {
    of: BooleanControl,
  },
  parameters: {
    relativeCsfPaths: [],
  },
};
