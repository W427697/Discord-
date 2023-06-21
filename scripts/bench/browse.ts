/* eslint-disable no-await-in-loop */
import type { Page, FrameLocator, Browser } from 'playwright';
import { chromium } from 'playwright';

import { now } from './utils';

const TIMEOUT = 20000;

interface Result {
  managerHeaderVisible?: number;
  managerIndexVisible?: number;
  storyVisible?: number;
  docsVisible?: number;
}

export const browse = async (url: string) => {
  const start = now();
  const result: Result = {};

  const browser = await chromium.launch(/* { headless: false } */);

  Object.assign(result, await benchStory(browser, url, start));
  Object.assign(result, await benchDocs(browser, url, start));

  await browser.close();

  return result;
};

async function benchDocs(browser: Browser, url: string, start: number) {
  const page = await browser.newPage();
  const result: Result = {};
  await page.goto(`${url}?path=/docs/example-button--docs`);

  const tasks = [
    async () => {
      let previewFrame: FrameLocator | Page = page;
      previewFrame = await page.frameLocator('#storybook-preview-iframe');

      let actualText;
      while (now() - start < TIMEOUT && (!actualText || !actualText.length)) {
        const preview = await previewFrame.getByText('Primary UI component for user interaction');
        actualText = await preview.innerText();
      }

      if (!actualText?.includes('Primary UI component for user interaction')) {
        throw new Error('docs not visible in time');
      }

      result.docsVisible = now() - start;
    },
  ];

  await Promise.all(tasks.map((t) => t()));

  await page.close();

  return result;
}

async function benchStory(browser: Browser, url: string, start: number) {
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
      let previewFrame: FrameLocator | Page = page;
      previewFrame = await page.frameLocator('#storybook-preview-iframe');

      let actualText;
      while (now() - start < TIMEOUT && (!actualText || !actualText.length)) {
        const preview = await previewFrame.getByText('Button');
        actualText = await preview.innerText();
      }

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
