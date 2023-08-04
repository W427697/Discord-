import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button, Icon } from '@storybook/components/experimental';

import { DropdownMenu } from './DropdownMenu';

const meta: Meta<typeof DropdownMenu.Root> = {
  title: 'DropdownMenu',
  component: DropdownMenu.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof DropdownMenu.Root>;

export const Default: Story = {
  args: {},
  render: (_, { args }) => (
    <DropdownMenu.Root {...args}>
      <DropdownMenu.Trigger asChild>
        <Button variant="tertiary" iconOnly icon={<Icon.Cog />}>
          ''
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={5}>
          <DropdownMenu.Item active>Item #1</DropdownMenu.Item>
          <DropdownMenu.Item>Item #2</DropdownMenu.Item>
          <DropdownMenu.Item disabled>Item #3</DropdownMenu.Item>
          <DropdownMenu.Item loading>Item #4</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  ),
};
