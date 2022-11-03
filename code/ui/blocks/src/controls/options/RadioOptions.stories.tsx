import React from 'react';
import { useArgs } from '@storybook/addons';
import type { Meta, StoryObj } from '@storybook/react';
import { OptionsControl } from './Options';

const arrayOptions = ['Bat', 'Cat', 'Rat'];
const labels = {
  Bat: 'Batwoman',
  Cat: 'Catwoman',
  Rat: 'Ratwoman',
};
const objectOptions = {
  A: { id: 'Aardvark' },
  B: { id: 'Bat' },
  C: { id: 'Cat' },
};

const meta = {
  title: 'Controls/Options/Radio',
  component: OptionsControl,
  tags: ['docsPage'],
  parameters: { controls: { include: ['argType', 'type', 'value', 'labels'] } },
  args: {
    type: 'radio',
    argType: { options: arrayOptions },
  },
  argTypes: {
    value: {
      control: { type: 'radio' },
      options: arrayOptions,
    },
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    const { value, onChange } = args;
    return (
      <>
        <OptionsControl
          {...args}
          name="options"
          onChange={(newValue) => {
            updateArgs({ value: newValue });
            onChange?.(newValue);
          }}
        />
        <pre>{JSON.stringify(value) || 'undefined'}</pre>
      </>
    );
  },
} as Meta<typeof OptionsControl>;

export default meta;

export const Array: StoryObj<typeof OptionsControl> = {
  args: {
    value: arrayOptions[0],
  },
};

export const ArrayInline: StoryObj<typeof OptionsControl> = {
  args: {
    type: 'inline-radio',
    value: arrayOptions[1],
  },
};

export const ArrayLabels: StoryObj<typeof OptionsControl> = {
  args: {
    value: arrayOptions[0],
    labels,
  },
};

export const ArrayInlineLabels: StoryObj<typeof OptionsControl> = {
  args: {
    type: 'inline-radio',
    value: arrayOptions[1],
    labels,
  },
};

export const ArrayUndefined: StoryObj<typeof OptionsControl> = {
  args: {
    value: undefined,
  },
};

export const Object: StoryObj<typeof OptionsControl> = {
  name: 'DEPRECATED: Object',
  args: {
    value: objectOptions.B,
    argType: { options: objectOptions },
  },
  argTypes: { value: { control: { type: 'object' } } },
};

export const ObjectInline: StoryObj<typeof OptionsControl> = {
  name: 'DEPRECATED: Object Inline',
  args: {
    type: 'inline-radio',
    value: objectOptions.A,
    argType: { options: objectOptions },
  },
  argTypes: { value: { control: { type: 'object' } } },
};

export const ObjectUndefined: StoryObj<typeof OptionsControl> = {
  name: 'DEPRECATED: Object Undefined',
  args: {
    value: undefined,
    argType: { options: objectOptions },
  },
  argTypes: { value: { control: { type: 'object' } } },
};
