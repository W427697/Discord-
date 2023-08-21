import React from 'react';
import type { FC, ChangeEvent } from 'react';
import { getControlId } from '../blocks/src/controls/helpers';

export const NativeTextArea: FC<any> = ({ name, value, onChange }) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return <textarea value={value} id={getControlId(name)} onChange={handleChange} />;
};
