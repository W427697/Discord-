import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { within, fireEvent } from '@storybook/testing-library';
import { addons } from '@storybook/preview-api';
import { RESET_STORY_ARGS, STORY_ARGS_UPDATED } from '@storybook/core-events';
import { BooleanControl } from './Boolean';

const meta = {
  component: BooleanControl,
  tags: ['autodocs'],
  parameters: {
    withRawArg: 'value',
    controls: { include: ['value'] },
    notes: 'These are notes for the Boolean control stories',
    info: 'This is info for the Boolean control stories',
    jsx: { useBooleanShorthandSyntax: false },
  },
} as Meta<typeof BooleanControl>;

export default meta;

export const True: StoryObj<typeof BooleanControl> = {
  args: {
    value: true,
    name: 'True',
  },
};
export const False: StoryObj<typeof BooleanControl> = {
  args: {
    value: false,
    name: 'False',
  },
};

export const Undefined: StoryObj<typeof BooleanControl> = {
  args: {
    value: undefined,
    name: 'Undefined',
  },
};

export const Toggling: StoryObj<typeof BooleanControl> = {
  args: {
    value: undefined,
    name: 'Toggling',
  },
  play: async ({ canvasElement, id, name, ...props }) => {
    const channel = addons.getChannel();

    channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise<void>((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });

    const canvas = within(canvasElement);

    // from Undefined to False
    const setBooleanControl = canvas.getByText('Set boolean');
    await fireEvent.click(setBooleanControl);

    let toggle = await canvas.findByLabelText(name);
    expect(toggle).toBeVisible();

    // from False to True
    await fireEvent.click(toggle);
    toggle = await canvas.findByRole('switch');
    expect(toggle).not.toBeChecked();

    // from True to False
    await fireEvent.click(toggle);
    toggle = await canvas.findByRole('switch');
    expect(toggle).toBeInTheDocument();
  },
};

export const TogglingInDocs: StoryObj<typeof BooleanControl> = {
  ...Toggling,
  args: {
    name: 'Toggling In Docs',
  },
  parameters: {
    docs: {
      autoplay: true,
    },
  },
};
