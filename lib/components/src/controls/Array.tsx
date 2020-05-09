import React, { FC, ChangeEvent, useCallback } from 'react';

import { Form } from '../form';
import { ControlProps, ArrayValue, ArrayConfig } from './types';

const parse = (value: string, separator: string): ArrayValue =>
  !value || value.trim() === '' ? [] : value.split(separator);

const format = (value: ArrayValue, separator: string) => {
  return value && Array.isArray(value) ? value.join(separator) : '';
};

export type ArrayProps = ControlProps<ArrayValue> & ArrayConfig;
export const ArrayControl: FC<ArrayProps> = ({ name, value, onChange, separator = ',' }) => {
  const text = format(value, separator);
  let prettyText;
  try {
    const jsonText = JSON.parse(text);
    prettyText = JSON.stringify(jsonText, null, 2);
  } catch (error) {
    prettyText = text;
  }
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>): void => {
      const { value: newVal } = e.target;
      onChange(name, parse(newVal, separator));
    },
    [onChange]
  );

  return (
    <Form.Textarea
      id={name}
      name={name}
      value={prettyText}
      onChange={handleChange}
      size="flex"
    />
  );
};
