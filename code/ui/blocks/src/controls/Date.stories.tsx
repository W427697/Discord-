import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/addons';
import { DateControl } from './Date';

export default {
  title: 'Controls/Date',
  // not using component here because we want to define argTypes ourselves
  tags: ['docsPage'],
  argTypes: {
    value: {
      description: 'Currently set date',
      control: { type: 'date' },
    },
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    const { value, onChange } = args;

    return (
      <>
        <DateControl
          {...args}
          name="date"
          onChange={(newValue) => {
            updateArgs({ value: newValue });
            onChange?.(newValue);
          }}
        />
        <pre>{JSON.stringify(value) || 'undefined'}</pre>
      </>
    );
  },
} as Meta<typeof DateControl>;

export const Basic: StoryObj<typeof DateControl> = {
  args: { value: new Date('2020-10-20T09:30:02') },
};
export const Undefined: StoryObj<typeof DateControl> = {
  args: { value: undefined },
};
