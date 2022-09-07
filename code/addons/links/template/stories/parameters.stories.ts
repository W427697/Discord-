import globalThis from 'global';
import { linkTo } from '@storybook/addon-links';

export default {
  component: globalThis.Components.Button,
  args: {
    children: 'Click Me!',
  },
  parameters: {
    chromatic: { disable: true },
  },
};

export const Basic = {
  args: {
    onClick: linkTo('basic'),
  },
};
export const Other = {
  args: {
    onClick: linkTo('basic'),
  },
};
export const Third = {
  args: {
    onClick: linkTo('other'),
  },
};

export const Callback = {
  args: {
    onClick: linkTo('Addons/Links', (event: Event) => 'basic'),
  },
};
