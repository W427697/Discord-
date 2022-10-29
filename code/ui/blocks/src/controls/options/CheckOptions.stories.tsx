import React, { useState } from 'react';
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
  title: 'Controls/Options/Check',
  component: OptionsControl,
  tags: ['docsPage'],
  args: {
    argType: { options: arrayOptions },
    type: 'check',
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
    value: [arrayOptions[0]],
  },
};

export const ArrayInline: StoryObj<typeof OptionsControl> = {
  args: {
    type: 'inline-check',
    value: [arrayOptions[1], arrayOptions[2]],
  },
};

export const ArrayLabels: StoryObj<typeof OptionsControl> = {
  args: {
    value: [arrayOptions[0]],
    labels,
  },
};

export const ArrayInlineLabels: StoryObj<typeof OptionsControl> = {
  args: {
    type: 'inline-check',
    value: [arrayOptions[1], arrayOptions[2]],
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
    value: [objectOptions.B],
    argType: { options: objectOptions },
  },
};

export const ObjectInline: StoryObj<typeof OptionsControl> = {
  name: 'DEPRECATED: Object Inline',
  args: {
    type: 'inline-check',
    value: [objectOptions.A, objectOptions.C],
    argType: { options: objectOptions },
  },
};

export const ObjectUndefined: StoryObj<typeof OptionsControl> = {
  name: 'DEPRECATED: Object Undefined',
  args: {
    value: undefined,
    argType: { options: objectOptions },
  },
};

const rawOptionsHelper = (options, type, isMulti, initial) => {
  const [value, setValue] = useState(isMulti ? [initial] : initial);
  return (
    <>
      <OptionsControl
        name="options"
        labels={{}}
        argType={{ options }}
        value={value}
        type={type}
        onChange={(newVal) => setValue(newVal)}
      />
      <pre>{JSON.stringify(value) || 'undefined'}</pre>
    </>
  );
};
