import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/addons';
import { TextControl } from './Text';

export default {
  title: 'Controls/Text',
  component: TextControl,
  tags: ['docsPage'],
  parameters: { controls: { include: ['value', 'maxLength'] } },
  render: (args) => {
    const [, updateArgs] = useArgs();
    const { value, onChange } = args;

    return (
      <>
        <TextControl
          {...args}
          name="text"
          onChange={(newValue) => {
            updateArgs({ value: newValue });
            onChange?.(newValue);
          }}
        />
        <pre>{JSON.stringify(value) || 'undefined'}</pre>
      </>
    );
  },
} as Meta<typeof TextControl>;

export const Basic: StoryObj<typeof TextControl> = {
  args: {
    value: 'Storybook says hi. 👋',
  },
};

export const Empty: StoryObj<typeof TextControl> = {
  args: {
    value: '',
  },
};

export const Undefined: StoryObj<typeof TextControl> = {
  args: {
    value: undefined,
  },
};

export const WithMaxLength: StoryObj<typeof TextControl> = {
  args: {
    value: "You can't finish this sente",
    maxLength: 28,
  },
};
