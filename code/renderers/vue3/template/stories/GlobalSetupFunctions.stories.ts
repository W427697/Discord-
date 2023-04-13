import { inject } from 'vue';
import { expect } from '@storybook/jest';

import { within } from '@storybook/testing-library';
import type { Meta, StoryObj } from '@storybook/vue3';
import GlobalSetup from './GlobalSetup.vue';

const meta = {
  component: GlobalSetup,
  argTypes: {},
  render: (args: any) => ({
    // Components used in your story `template` are defined in the `components` object
    components: { GlobalSetup },
    // The story's `args` need to be mapped into the template through the `setup()` method
    setup() {
      const themeColor = inject('themeColor', 'red'); // <-- this is the global setup from .storybook/preview.ts
      return { args: { ...args, backgroundColor: themeColor } };
    },
    // And then the `args` are bound to your component with `v-bind="args"`
    template: `<global-setup v-bind="args" />`,
  }),
} satisfies Meta<typeof GlobalSetup>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Global Setup Injected themeColor',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.getByRole('button');
    console.log('button', button);
    await expect(button).toHaveStyle('background-color: rgb(0, 128, 0)'); // <-- this provide themeColor = green from .storybook/preview.ts
    const h4 = await canvas.getByRole('heading', { level: 4 });
    await expect(h4).toHaveTextContent('Bonjour! from plugin your name is Primary!');
  },
};

export const Secondary = {
  args: {
    label: 'Global Setup Injected themeColor',
  },
};
