import { expect, fn, within } from '@storybook/test';
import Paths from './Paths.svelte';

export default {
  title: 'stories/sveltekit/modules/paths',
  component: Paths,
  tags: ['autodocs'],
};

export const Default = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    expect(canvas.getByTestId('assets')).toBeInTheDocument();
    expect(canvas.getByTestId('base')).toBeInTheDocument();
  },
};
