import globalThis from 'global';

export default {
  component: globalThis.Components.Button,
  args: { children: 'Rendered in iframe' },
  parameters: {
    chromatic: { disable: true },
    docs: { iframeHeight: 120, inlineStories: true },
  },
};

export const Basic = {};
