import globalThis from 'global';
import { createElement } from 'react';
import { Title, Primary } from '@storybook/addon-docs';

// FIXME: do this using basic React functions for multi-framework
//        once sandbox linking is working
// const Override = () =>
//   createElement('div', { style: { border: '10px solid green', padding: '100px' } }, [
//     createElement(Title),
//     createElement(Primary),
//   ]);
const Override = () => 'overridden';

export default {
  component: globalThis.Components.Button,
  args: { children: 'Click Me!' },
  parameters: {
    chromatic: { disable: true },
    docs: { page: Override },
  },
};

export const Basic = {};
