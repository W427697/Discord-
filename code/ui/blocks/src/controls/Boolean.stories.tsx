import React, { useState } from 'react';
import { BooleanControl } from './Boolean';

export default {
  title: 'Controls/Boolean',
  component: BooleanControl,
  tags: ['docsPage'],
};

const Template = (initialValue?: boolean) => {
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <BooleanControl name="boolean" value={value} onChange={(newVal) => setValue(newVal)} />
      <pre>{JSON.stringify(value) || 'undefined'}</pre>
    </>
  );
};

export const True = () => Template(true);

export const False = () => Template(false);

/**
 * When no value is set on the control
 */
export const Undefined = () => Template(undefined);
