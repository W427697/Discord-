import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { within, fireEvent } from '@storybook/testing-library';
import { addons } from '@storybook/preview-api';
import { RESET_STORY_ARGS, STORY_ARGS_UPDATED } from '@storybook/core-events';
import React from 'react';
import { Button } from './Button';

const meta = {
  title: 'examples/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  parameters: {
    // Stop *this* story from being stacked in Chromatic
    theme: 'default',
    // these are to test the deprecated features of the Description block
    notes: 'These are notes for the Button stories',
    info: 'This is info for the Button stories',
    jsx: { useBooleanShorthandSyntax: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * This is the primary mode for the button
 *
 * _this description was written as a comment above the story_
 */
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
  parameters: {
    docs: {
      description: {
        story: `
This is the secondary - or default - mode for the button

_this description was written as a string in \`parameters.docs.description.story\`_`,
      },
    },
  },
};

/**
 * This is the large button
 * _this description was written as a comment above the story, and should never be shown because it should be overriden by the description in the parameters_
 */
export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
  parameters: {
    docs: {
      description: {
        story: `
This is the large button

_this description was written as a string in \`parameters.docs.description.story\`, and overrides the comment above the story_
`,
      },
    },
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
};

export const Clicking: Story = {
  args: {
    primary: true,
    label: 'Increment',
  },
  render: (args) => {
    const [count, setCount] = React.useState(0);
    return (
      <>
        <Button {...args} onClick={() => setCount(count + 1)} />
        <div style={{ padding: '1rem' }}>Click count: {count}</div>
      </>
    );
  },
  play: async ({ canvasElement, id }) => {
    const channel = addons.getChannel();

    channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise<void>((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });

    const canvas = within(canvasElement);

    const button = canvas.getByText('Increment');
    await fireEvent.click(button);

    expect(canvas.getByText('Click count: 1')).toBeInTheDocument();
  },
};

export const ClickingInDocs: Story = {
  ...Clicking,
  parameters: { docs: { story: { autoplay: true } } },
};

export const ErrorStory: Story = {
  render: () => {
    const err = new Error('Rendering problem');
    // force stack for consistency in capture
    err.stack = `Error: Rendering problem
    at render (http://localhost:6010/blocks/src/examples/Button.stories.tsx?t=1677124831161:147:11)
    at undecoratedStoryFn (http://localhost:6010/sb-preview/runtime.mjs:8255:38)
    at http://localhost:6010/sb-preview/runtime.mjs:7286:21
    at http://localhost:6010/sb-preview/runtime.mjs:8225:12
    at jsxDecorator (http://localhost:6010/node_modules/.cache/.vite-storybook/deps/@storybook_react_preview.js?v=0fc15c2d:1892:17)
    at http://localhost:6010/sb-preview/runtime.mjs:7286:21
    at http://localhost:6010/sb-preview/runtime.mjs:8200:23
    at http://localhost:6010/sb-preview/runtime.mjs:8225:12
    at wrapper (http://localhost:6010/node_modules/.cache/.vite-storybook/deps/@storybook_addon-links_preview.js?v=0fc15c2d:66:12)
    at http://localhost:6010/sb-preview/runtime.mjs:11942:12`;
    throw err;
  },
  args: { label: 'Button' },
  parameters: {
    chromatic: { disable: true },
  },
};
