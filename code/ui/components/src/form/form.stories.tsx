import React, { useState } from 'react';
import { styled } from '@storybook/theming';
import { action } from '@storybook/addon-actions';

import * as InputComponents from './input/input';
import { Field as FieldComponent } from './field/field';
import { Spaced } from '../spaced/Spaced';

const Flexed = styled(FieldComponent)({ display: 'flex' });

export default {
  title: 'Form',
};

const sharedArgTypes = {
  disabled: {
    defaultValue: false,
    control: {
      type: 'boolean',
    },
  },
  size: {
    defaultValue: 'auto',
    control: {
      type: 'radio',
      // TODO: weak typings
      options: ['100%', 'auto', 'flex'] as InputComponents.Sizes[],
    },
  },
  valid: {
    control: {
      type: 'radio',
      // TODO: weak typings
      options: [null, 'valid', 'warn', 'error'] as InputComponents.ValidationStates[],
    },
  },
  align: {
    control: {
      type: 'radio',
      // TODO: weak typings
      options: [null, 'start', 'center', 'end'] as InputComponents.Alignments[],
    },
  },
};

export const Field = {
  render: (args: any) => (
    <FieldComponent key="key" {...args}>
      <InputComponents.Select value="val2" onChange={action('onChange')}>
        <option value="val1">Value 1</option>
        <option value="val2">Value 2</option>
        <option value="val3">Value 3</option>
      </InputComponents.Select>
    </FieldComponent>
  ),
  argTypes: {
    label: {
      defaultValue: 'label',
      control: {
        type: 'text',
      },
    },
  },
};

export const Select = {
  render: (args: any) => (
    <Flexed>
      <InputComponents.Select onChange={action('onChange')} {...args}>
        <option value="val1">Value 1</option>
        <option value="val2">Value 2</option>
        <option value="val3">Value 3</option>
      </InputComponents.Select>
    </Flexed>
  ),
  argTypes: {
    ...sharedArgTypes,
    value: {
      defaultValue: 'val2',
      control: {
        type: 'radio',
        options: ['val1', 'val2', 'val3'],
      },
    },
  },
};

export const Button = {
  render: (args: any) => (
    <Flexed>
      <InputComponents.Button {...args}>Form Button</InputComponents.Button>
    </Flexed>
  ),
  argTypes: sharedArgTypes,
};

export const Textarea = {
  render: (args: any) => (
    <Flexed>
      <InputComponents.Textarea {...args} />
    </Flexed>
  ),
  argTypes: {
    ...sharedArgTypes,
    height: {
      control: {
        type: 'number',
      },
    },
  },
};

export const Input = {
  render: (args: any) => (
    <Flexed>
      <InputComponents.Input {...args} />
    </Flexed>
  ),
  argTypes: {
    ...sharedArgTypes,
    value: {
      control: {
        type: 'text',
      },
    },
    placeholder: {
      control: {
        type: 'text',
      },
      defaultValue: 'Placeholder',
    },
  },
};

export const NumericInputSizes = {
  render: () => {
    const [auto, setAuto] = useState(0);
    const [flex, setFlex] = useState(0);
    const [full, setFull] = useState(0);
    const [content, setContent] = useState(0);
    return (
      <Spaced>
        {[
          { size: 'auto', value: auto, onChange: setAuto },
          { size: 'flex', value: flex, onChange: setFlex },
          { size: '100%', value: full, onChange: setFull },
          { size: 'content', value: content, onChange: setContent },
        ].map(({ size, value, onChange }) => (
          <Flexed key={size} label={size}>
            <InputComponents.NumericInput value={value} onChange={onChange} size={size} />
          </Flexed>
        ))}
      </Spaced>
    );
  },
};

export const NumericInputValidations = {
  render: () => {
    const [error, setError] = useState(0);
    const [warn, setWarn] = useState(0);
    const [validity, setValidity] = useState(0);
    const [nullState, setNull] = useState(0);
    return (
      <Spaced>
        {[
          { valid: 'error', value: error, onChange: setError },
          { valid: 'warn', value: warn, onChange: setWarn },
          { valid: 'valid', value: validity, onChange: setValidity },
          { valid: null, value: nullState, onChange: setNull },
        ].map(({ valid, value, onChange }) => (
          <Flexed key={valid} label={String(valid)}>
            <InputComponents.NumericInput
              value={value}
              onChange={onChange}
              size="100%"
              valid={valid}
            />
          </Flexed>
        ))}
      </Spaced>
    );
  },
};

export const NumericInputAlignment = {
  render: () => {
    const [end, setEnd] = useState(0);
    const [center, setCenter] = useState(0);
    const [start, setStart] = useState(0);
    return (
      <Spaced>
        {[
          { align: 'end', value: end, onChange: setEnd },
          { align: 'center', value: center, onChange: setCenter },
          { align: 'start', value: start, onChange: setStart },
        ].map(({ align, value, onChange }) => (
          <Flexed key={align} label={align}>
            <InputComponents.NumericInput
              value={value}
              onChange={onChange}
              size="100%"
              align={align}
            />
          </Flexed>
        ))}
      </Spaced>
    );
  },
};
