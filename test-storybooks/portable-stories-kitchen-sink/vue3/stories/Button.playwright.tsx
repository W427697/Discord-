import { test as base } from '@playwright/experimental-ct-vue';
import { createTest } from '@storybook/vue3/experimental-playwright';
import stories, { Single, SingleWithRender } from './Button.stories.playwright';


const test = createTest(base);

test('renders without render', async ({ mount }) => {
  await mount(<Single label="other"/>);
});
test('renders with render', async ({ mount }) => {
  // TODO: doesn't work, renders blank
  await mount(<SingleWithRender />); 
});
