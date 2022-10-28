import React from 'react';
import { useArgs } from '@storybook/addons';
import type { Meta, StoryObj } from '@storybook/react';
import { BooleanControl } from './Boolean';

const meta = {
  title: 'Controls/Boolean',
  tags: ['docsPage'],
  argTypes: {
    value: {
      control: {
        type: 'boolean',
      },
    },
  },
  render: (args: typeof meta['args']) => {
    const [, updateArgs] = useArgs();
    const { value, onChange } = args;
    return (
      <>
        <BooleanControl
          name="boolean"
          {...args}
          onChange={(newValue) => {
            updateArgs({ value: newValue });
            onChange?.(newValue);
          }}
        />
        <pre>{JSON.stringify(value) || 'undefined'}</pre>
      </>
    );
  },
} as Meta<typeof BooleanControl>;

export default meta;

export const True: StoryObj<typeof meta> = {
  args: {
    value: true,
  },
};
export const False: StoryObj<typeof meta> = {
  args: {
    value: false,
  },
};

export const Undefined: StoryObj<typeof meta> = {
  args: {
    value: undefined,
  },
};
