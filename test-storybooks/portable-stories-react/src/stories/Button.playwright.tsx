/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from '@playwright/experimental-ct-react';
import stories from './Button.portable';
import { mountStory, playStory } from '../../playwright/storybook-utils';

// Basic scenario that does not need loaders nor play fn
test('renders primary button', async ({ mount }) => {
  const component = await mount(<stories.CSF3Primary />);
  await expect(component).toContainText('Decorator')
});

// imports => beforeMount => mount => afterMount

// Alternative: beforeMount + afterMount hooks that will load and play the story
test.only('apply story loaders from hooks', async ({ mount }) => {
  await mount(<stories.LoaderStory/>, { hooksConfig: { storyName: 'LoaderStory' }});
});

// Alternative: standalone play fn after component is mounted. Needs beforeMount hook for loading the story
test.skip('apply story loaders + play story', async ({ mount, page }) => {
  await mount(<stories.LoaderStory/>, { hooksConfig: { storyName: 'LoaderStory' }});
  await playStory('LoaderStory', page);
});

// Alternative: A single mount fn that loads and plays the story. Would need no hooks but it's tricky and we don't have it working
test.skip('apply story loaders from wrapper fn', async ({ mount, page }) => {
  await mountStory({ mount, page }, stories.LoaderStory);
});

// PW UNWRAP Experiment stuff

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const playTheStory = async (story: any, page: any) => {
//   await page.evaluate(async (story: any) => {
//     // example of getting access to the component reference via playwright shenanigans
//     const component = await window.__pwUnwrapObject(story);
//     component.play({ canvasElement: document.querySelector('#root') })
//   }, story);
// }

// // Alternative: custom load and play functions coming from context
// test.skip('with custom context properties', async ({ mount, load, play }) => {
//   await load(stories.LoaderStory);
//   await mount(<stories.LoaderStory/>);
//   await play(stories.LoaderStory);
// });

// // Alternative: custom mountStory property that does everything
// test.only('with custom mount story', async ({ mountStory }) => {
//   await mountStory(<stories.LoaderStory/>);
// });

