import globalThis from 'global';

export default {
  component: globalThis.Components.Button,
  args: { onClick: () => console.log('clicked!') },
  parameters: {
    chromatic: { disable: true },
  },
};

export const Basic = {
  args: { children: 'Basic' },
};

export const One = {
  args: { children: 'One' },
};

export const Two = {
  args: { children: 'Two' },
};
