import React from 'react';
import { useArgs } from '@storybook/addons';
import type { Meta, StoryObj } from '@storybook/react';
import { BooleanControl } from './Boolean';

const meta = {
  component: BooleanControl,
  tags: ['docsPage'],
  parameters: { controls: { include: ['value'] } },
  render: (args) => {
    const [, updateArgs] = useArgs();
    const { value, onChange } = args;
    return (
      <>
        <BooleanControl
          {...args}
          name="boolean"
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

export const True: StoryObj<typeof BooleanControl> = {
  args: {
    value: true,
  },
};
export const False: StoryObj<typeof BooleanControl> = {
  args: {
    value: false,
  },
};

export const Undefined: StoryObj<typeof BooleanControl> = {
  args: {
    value: undefined,
  },
};
