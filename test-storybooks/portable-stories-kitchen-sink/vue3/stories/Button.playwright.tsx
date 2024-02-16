import { test } from '@playwright/experimental-ct-vue';

import stories from './Button.portable';

import Button from './Button.vue';

test('renders primary button', async ({ mount }) => {
  console.log(Button);
  console.log(stories.CSF3Primary);
  // TODO: this is not working, probably the translation that Playwright does won't work
  // as stories.CSF3Primary is not a Vue component from a Vue file
  await mount(stories.CSF3Primary);
});
