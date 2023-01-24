/// <reference types="vite/client" />
import type { Meta, StoryObj } from '@storybook/react';

import { Story as StoryBlock } from '../Story';
import * as ButtonStories from '../../examples/Button.stories';

const meta: Meta<typeof StoryBlock> = {
  component: StoryBlock,
  parameters: {
    relativeCsfPaths: ['../examples/Button.stories'],
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const StoryExport: Story = {
  args: {
    story: ButtonStories.Primary,
  },
};

const blocksAwareId = `${
  import.meta.env.STORYBOOK_BLOCKS_ONLY === 'true' ? '' : 'storybook-blocks-'
}examples-button--primary`;

export const Id: Story = {
  args: {
    id: blocksAwareId,
  },
};

export const Name: Story = {
  args: {
    name: 'Secondary',
  },
};
