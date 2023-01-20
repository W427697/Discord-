import type { Meta, StoryObj } from '@storybook/react';

import { Story as StoryBlock } from '../Story';

const meta: Meta<typeof StoryBlock> = {
  component: StoryBlock,
  parameters: {
    relativeCsfPaths: ['../examples/Button.stories'],
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

const blocksAwareId = `${
  import.meta.env.STORYBOOK_BLOCKS_ONLY === 'true' ? '' : 'storybook-blocks-'
}example-button--primary`;

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
