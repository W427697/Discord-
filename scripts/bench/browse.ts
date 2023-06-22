import type { Page, FrameLocator } from 'playwright';
import { chromium } from 'playwright';

import { now } from './utils';

interface Result {
  managerHeaderVisible?: number;
  managerIndexVisible?: number;
  storyVisible?: number;
  storyVisibleUncached?: number;
  autodocsVisible?: number;
  mdxVisible?: number;
}

export const browse = async (url: string) => {
  const result: Result = {};

  /* Heat up time for playwright and the builder
   * This is to avoid the first run being slower than the rest
   * which can happen due to vite or webpack lazy compilation
   * We visit the story and the docs page, so those should be fully cached
   *
   * We instantiate a new browser for each run to avoid any caching happening in the browser itself
   */
  const x = await benchStory(url);
  await benchAutodocs(url);

  result.storyVisibleUncached = x.storyVisible;

  Object.assign(result, await benchMDX(url));
  Object.assign(result, await benchStory(url));
  Object.assign(result, await benchAutodocs(url));

  return result;
};

async function benchAutodocs(url: string) {
  const browser = await chromium.launch(/* { headless: false } */);
  await browser.newContext();
  const page = await browser.newPage();
  const start = now();
  const result: Result = {};
  await page.goto(`${url}?path=/docs/example-button--docs`);

  const tasks = [
    async () => {
      let previewFrame: FrameLocator | Page = page;
      previewFrame = await page.frameLocator('#storybook-preview-iframe');

      const preview = await previewFrame.getByText('Primary UI component for user interaction');
      const actualText = await preview.innerText();

      if (!actualText?.includes('Primary UI component for user interaction')) {
        throw new Error('docs not visible in time');
      }

      result.autodocsVisible = now() - start;
    },
  ];

  await Promise.all(tasks.map((t) => t()));

  await page.close();

  return result;
}

async function benchMDX(url: string) {
  const browser = await chromium.launch(/* { headless: false } */);
  await browser.newContext();
  const page = await browser.newPage();
  const start = now();
  const result: Result = {};
  await page.goto(`${url}?path=/docs/configure-your-project--docs`);

  const tasks = [
    async () => {
      let previewFrame: FrameLocator | Page = page;
      previewFrame = await page.frameLocator('#storybook-preview-iframe');

      const preview = await previewFrame.getByText('Configure your project');
      const actualText = await preview.innerText();

      if (!actualText?.includes('Configure your project')) {
        throw new Error('docs not visible in time');
      }

      result.mdxVisible = now() - start;
    },
  ];

  await Promise.all(tasks.map((t) => t()));

  await page.close();

  return result;
}

async function benchStory(url: string) {
  const browser = await chromium.launch(/* { headless: false } */);
  const start = now();
  await browser.newContext();
  const page = await browser.newPage();
  const result: Result = {};
  await page.goto(`${url}?path=/story/example-button--primary`);

  const tasks = [
    //
    async () => {
      await page.waitForSelector('.sidebar-header', { state: 'attached' });
      result.managerHeaderVisible = now() - start;
    },
    async () => {
      await page.waitForSelector('#example-button--primary', { state: 'attached' });
      result.managerIndexVisible = now() - start;
    },
    async () => {
      const previewFrame: FrameLocator | Page = await page.frameLocator(
        '#storybook-preview-iframe'
      );

      const preview = await previewFrame.getByText('Button');
      const actualText = await preview.innerText();

      if (!actualText?.includes('Button')) {
        throw new Error('preview not visible in time');
      }

      result.storyVisible = now() - start;
    },
  ];

  await Promise.all(tasks.map((t) => t()));

  await page.close();

  return result;
}
