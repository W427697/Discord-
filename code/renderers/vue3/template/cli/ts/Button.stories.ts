import type { Meta, StoryObj } from '@storybook/vue3';
import { UPDATE_STORY_ARGS } from '@storybook/core-events';
import { within } from '@storybook/testing-library';

import type { PlayFunctionContext } from '@storybook/csf';
import Button from './Button.vue';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/vue/writing-stories/introduction
const meta = {
  title: 'Example/Button',
  component: Button,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    backgroundColor: { control: 'color' },
    onClick: { action: 'clicked' },
  },
  args: { primary: false }, // default value
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    primary: false,
    label: 'Button',
  },
};

export const Large: Story = {
  args: {
    label: 'Button',
    size: 'large',
  },
};

export const Small: Story = {
  args: {
    label: 'Button',
    size: 'small',
  },
};

export const Reactive: Story = {
  args: {
    label: 'Button',
  },
  // test that args are updated correctly in rective mode
  play: async ({ canvasElement, id }: PlayFunctionContext<any>) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    const canvas = within(canvasElement);
    const reactiveButton = await canvas.getByRole('button');

    const interval = setInterval(() => {
      if (reactiveButton) reactiveButton.click();
      if (!reactiveButton.parentNode) {
        clearInterval(interval);
      }
    }, 1000);

    setTimeout(
      () =>
        channel.emit(UPDATE_STORY_ARGS, {
          storyId: 'example-button--reactive',
          updatedArgs: { label: 'Label updated ', size: 'large' },
        }),
      5000
    );
  },
};
