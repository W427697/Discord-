import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { within, fireEvent } from '@storybook/testing-library';
import { addons } from '@storybook/preview-api';
import { RESET_STORY_ARGS, STORY_ARGS_UPDATED } from '@storybook/core-events';
import React from 'react';
import { Button } from './Button';

const meta = {
  title: 'Example/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
    // @ts-expect-error Meta type is trying to force us to use real props as args
    extraMetaArgType: {
      type: { name: 'string' },
      name: 'Extra Meta',
      description: 'An extra argtype added at the meta level',
      table: { defaultValue: { summary: "'a default value'" } },
    },
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
  argTypes: {
    // @ts-expect-error Story type is trying to force us to use real props as args
    extraStoryArgType: {
      type: { name: 'string' },
      name: 'Extra Story',
      description: 'An extra argtype added at the story level',
      table: { defaultValue: { summary: "'a default value'" } },
    },
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
