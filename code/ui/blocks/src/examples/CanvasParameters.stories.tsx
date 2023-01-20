import type { Meta, StoryObj } from '@storybook/react';

import { EmptyExample } from './EmptyExample';

const meta = {
  title: 'example/CanvasParameters',
  component: EmptyExample,
} satisfies Meta<typeof EmptyExample>;
export default meta;

type Story = StoryObj<typeof meta>;

export const LayoutFullscreen: Story = {
  parameters: { layout: 'fullscreen' },
};
export const LayoutPadded: Story = {
  parameters: { layout: 'padded' },
};
export const LayoutCentered: Story = {
  parameters: { layout: 'centered' },
};

export const DocsCanvasLayoutFullscreen: Story = {
  parameters: { docs: { canvas: { layout: 'fullscreen' } } },
};
export const DocsCanvasLayoutPadded: Story = {
  parameters: { docs: { canvas: { layout: 'padded' } } },
};
export const DocsCanvasLayoutCentered: Story = {
  parameters: { docs: { canvas: { layout: 'centered' } } },
};
