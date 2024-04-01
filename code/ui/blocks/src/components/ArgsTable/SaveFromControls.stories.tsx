import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { SaveFromControls } from './SaveFromControls';

const meta = {
  component: SaveFromControls,
  title: 'Components/ArgsTable/SaveFromControls',
  args: {
    saveStory: action('saveStory'),
    createStory: action('createStory'),
    resetArgs: action('resetArgs'),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SaveFromControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
