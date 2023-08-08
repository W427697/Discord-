import type { Meta, StoryObj } from '@storybook/react';
import { TestComponent } from './TestComponent';

const meta = {
  component: TestComponent,
  title: 'TestComponent',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TestComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: 'yellow',
  },
};
