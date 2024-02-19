import { createTest } from '@storybook/vue3/experimental-playwright';
import { test as base } from '@playwright/experimental-ct-vue';

import stories from './Button.portable';

const test = createTest(base);

test('renders primary button', async ({ mount }) => {
  // TODO: this is not working, probably the translation that Playwright does won't work
  // as stories.CSF3Primary is not a Vue component from a Vue file
  await mount(stories.LoaderStory); 
});
