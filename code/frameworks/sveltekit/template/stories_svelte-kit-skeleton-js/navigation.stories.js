import { expect, fn, within } from '@storybook/test';
import Navigation from './Navigation.svelte';

export default {
  title: 'stories/sveltekit/modules/Navigation',
  component: Navigation,
  tags: ['autodocs'],
};

const goto = fn();

export const Goto = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const button = canvas.getByText('goto');
    button.click();
    expect(goto).toHaveBeenCalledWith('/storybook');
  },
  parameters: {
    sveltekit: {
      navigation: {
        goto,
      },
    },
  },
};

const invalidate = fn();

export const Invalidate = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const button = canvas.getByText('invalidate', { exact: true });
    button.click();
    expect(invalidate).toHaveBeenCalledWith('/storybook');
  },
  parameters: {
    sveltekit: {
      navigation: {
        invalidate,
      },
    },
  },
};

const invalidateAll = fn();

export const InvalidateAll = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const button = canvas.getByText('invalidateAll');
    button.click();
    console.log({ button });
    expect(invalidateAll).toHaveBeenCalledWith();
  },
  parameters: {
    sveltekit: {
      navigation: {
        invalidateAll,
      },
    },
  },
};

const afterNavigateFn = fn();

export const AfterNavigate = {
  async play() {
    expect(afterNavigateFn).toHaveBeenCalledWith({ test: 'passed' });
  },
  args: {
    afterNavigateFn,
  },
  parameters: {
    sveltekit: {
      navigation: {
        afterNavigate: {
          test: 'passed',
        },
      },
    },
  },
};
