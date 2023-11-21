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
    const a = canvas.getByText('Storybook');
    // eslint-disable-next-line no-undef
    const oldUrl = window.location.toString();
    a.click();
    // eslint-disable-next-line no-undef
    const newUrl = window.location.toString();
    expect(newUrl).toBe(oldUrl);
    console.log({ newUrl, oldUrl });
    expect(link).toHaveBeenCalled();
  },
  parameters: {
    sveltekit_experimental: {
      hrefs: {
        '/storybook': link,
      },
    },
  },
};
