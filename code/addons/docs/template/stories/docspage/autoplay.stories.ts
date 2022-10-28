import globalThis from 'global';

export default {
  component: globalThis.Components.Button,
  tags: ['docsPage'],
  args: { label: 'Click Me!' },
  parameters: { chromatic: { disable: true } },
};

// Should not autoplay
export const Basic = {
  play: async ({ id }) => {
    console.log(`story ${id} played`);
  },
};

// Should autoplay
export const Autoplay = {
  parameters: { docs: { autoplay: true } },
  play: async (context) => {
    await Basic.play(context);
  },
};
