import React from 'react';
import { useAddonState } from '@storybook/client-api';

export default {
  title: 'addons|useAddonState',
};

// interface KnobsConfig {
//   [knobId: string]: {
//     type: 'text' | 'select' | 'boolean';
//     values?: any[];
//     value: any;
//   };
// }

export const variant1 = () => {
  const [state, setState] = useAddonState<string>('test', 'fooo');

  return (
    <button
      type="button"
      onClick={() => {
        setState('baz');
      }}
    >
      {state}
    </button>
  );
};
