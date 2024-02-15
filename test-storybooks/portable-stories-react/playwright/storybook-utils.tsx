import { test } from '@playwright/experimental-ct-react'
/* eslint-disable @typescript-eslint/no-explicit-any */
export type StorybookHooksConfig = {
  storyName?: string;
};

// HOOKS so that they load + play the story automatically
export async function beforeMount({
  hooksConfig,
}: {
  hooksConfig: StorybookHooksConfig | undefined;
}) {
  console.log("internal before mount")

  const { storyName } = hooksConfig || {};
  if (storyName) {
    const story = (globalThis as any).__STORYBOOK_PORTABLE_STORIES[storyName];
    await story.load();
    (globalThis as any).__STORYBOOK_CURRENT_STORY = story;
  }
}

export async function afterMount({
  hooksConfig,
}: {
  hooksConfig: StorybookHooksConfig | undefined;
}) {
  console.log("internal after mount")
  const { storyName } = hooksConfig || {};
  if (storyName) {
    const story = (globalThis as any).__STORYBOOK_PORTABLE_STORIES[storyName];
    // the component needs an extra tick to be mounted
    // await new Promise((resolve) => setTimeout(resolve, 0));
    await story.play({
      canvasElement: document.querySelector('#root'),
    });
  }
}

// BOOTSTRAP fn to set up hooks for the user
export function bootstrap({
  beforeMount: beforeMountFn,
  afterMount: afterMountFn,
}: {
  beforeMount: any;
  afterMount: any;
}) {
  beforeMountFn(beforeMount);
  afterMountFn(afterMount);
}

// STANDALONE UTILS for loading and playing the story
export async function loadStory(storyName: string, page: any) {
  await page.evaluate(async (storyName: string) => {
    if (storyName) {
      const story = (globalThis as any).__STORYBOOK_PORTABLE_STORIES[storyName];
      await story.load();
    }
  }, storyName)
}

export async function playStory(storyName: string, page: any) {
  await page.evaluate(async (storyName: string) => {
    const story = (globalThis as any).__STORYBOOK_PORTABLE_STORIES[storyName];
    if (story) {
      // the component needs an extra tick to be mounted
      await new Promise((resolve) => setTimeout(resolve, 0));
      await story.play({
        canvasElement: document.querySelector('#root'),
      });
    }
  }, storyName)
}

// POTENTIAL MOUNT wrapper that does everything (would become a Playwright fixture)
type mountParam = Parameters<typeof test>[1]
type params = Pick<Parameters<mountParam>[0], 'mount' | 'page'>

export async function mountStory({ page, mount}: params, Story: any) {
  const component = await mount(<Story />, {hooksConfig: {storyName: 'LoaderStory'}});
  await component.unmount()
  await loadStory('LoaderStory', page)
  await mount(<Story />, {hooksConfig: {storyName: 'LoaderStory'}})
  await playStory('LoaderStory', page)
}

