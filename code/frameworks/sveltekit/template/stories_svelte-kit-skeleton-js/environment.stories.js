import { expect, fn, within } from '@storybook/test';
import Environment from './Environment.svelte';

export default {
  title: 'stories/sveltekit/modules/environment',
  component: Environment,
  tags: ['autodocs'],
};

export const Default = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    expect(canvas.getByTestId('browser')).toBeInTheDocument();
    expect(canvas.getByTestId('dev')).toBeInTheDocument();
    expect(canvas.getByTestId('building')).toBeInTheDocument();
    expect(canvas.getByTestId('version')).toBeInTheDocument();
  },
};
