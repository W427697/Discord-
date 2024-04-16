import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from './theme';

const meta = {
  component: Theme,
  title: 'Theme',
  argTypes: {
    accent: { control: 'color' },
    background: { control: 'color' },
    toolbarAccent: { control: 'color' },
    toolbarBackground: { control: 'color' },
    addonsPanelBackground: { control: 'color' },
    doc: { control: 'color' },
    group: { control: 'color' },
    component: { control: 'color' },
    story: { control: 'color' },
  },
} satisfies Meta<typeof Theme>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    accent: '#029cfd',
    background: '#F6F9FC',
    toolbarAccent: '#029cfd',
    toolbarBackground: '#ffffff',
    addonsPanelAccent: '#029cfd',
    addonsPanelBackground: '#ffffff',
    doc: '#FFAE00',
    group: '#6F2CAC',
    component: '#029CFD',
    story: '#37D5D3',
  },
};
