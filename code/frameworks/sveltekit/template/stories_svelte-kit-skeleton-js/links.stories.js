import { expect, fn, within } from '@storybook/test';
import Links from './Links.svelte';

export default {
  title: 'stories/sveltekit/modules/Links',
  component: Links,
  tags: ['autodocs'],
};

const link = fn();

export const Link = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const button = canvas.getByText('Storybook');
    button.click();
    expect(link).toHaveBeenCalled();
  },
  parameters: {
    sveltekit: {
      hrefs: {
        '/storybook': link,
      },
    },
  },
};
