import React from 'react';
import { useArgs } from '@storybook/addons';
import type { Meta, StoryObj } from '@storybook/react';
import { OptionsControl } from './Options';

const arrayOptions = ['Bat', 'Cat', 'Rat'];
const objectOptions = {
  A: { id: 'Aardvark' },
  B: { id: 'Bat' },
  C: { id: 'Cat' },
};
const labels = {
  Bat: 'Batwoman',
  Cat: 'Catwoman',
  Rat: 'Ratwoman',
};
const argTypeMultiSelect = {
  argTypes: {
    value: {
      control: { type: 'multi-select' },
      options: arrayOptions,
    },
  },
};

const meta = {
  title: 'Controls/Options/Select',
  component: OptionsControl,
  tags: ['docsPage'],
  parameters: { controls: { include: ['argType', 'type', 'value', 'labels'] } },
  args: {
    type: 'select',
    argType: { options: arrayOptions },
  },
  argTypes: {
    value: {
      control: { type: 'select' },
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

export const ArrayMulti: StoryObj<typeof OptionsControl> = {
  args: {
    type: 'multi-select',
    value: [arrayOptions[1], arrayOptions[2]],
  },
  ...argTypeMultiSelect,
};

export const ArrayUndefined: StoryObj<typeof OptionsControl> = {
  args: {
    value: undefined,
  },
};

export const ArrayMultiUndefined: StoryObj<typeof OptionsControl> = {
  args: {
    type: 'multi-select',
    value: undefined,
  },
  ...argTypeMultiSelect,
};

export const ArrayLabels: StoryObj<typeof OptionsControl> = {
  args: {
    value: arrayOptions[0],
    labels,
  },
};

export const ArrayMultiLabels: StoryObj<typeof OptionsControl> = {
  args: {
    type: 'multi-select',
    value: [arrayOptions[1], arrayOptions[2]],
    labels,
  },
  ...argTypeMultiSelect,
};

export const Object: StoryObj<typeof OptionsControl> = {
  name: 'DEPRECATED: Object',
  args: {
    value: objectOptions.B,
    argType: { options: objectOptions },
  },
  argTypes: { value: { control: { type: 'object' } } },
};

export const ObjectMulti: StoryObj<typeof OptionsControl> = {
  name: 'DEPRECATED: Object Multi',
  args: {
    type: 'multi-select',
    value: [objectOptions.A, objectOptions.B],
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

export const ObjectMultiUndefined: StoryObj<typeof OptionsControl> = {
  name: 'DEPRECATED: Object Multi Undefined',
  args: {
    type: 'multi-select',
    value: undefined,
    argType: { options: objectOptions },
  },
  argTypes: { value: { control: { type: 'object' } } },
};
