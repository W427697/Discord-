/* eslint-disable no-await-in-loop */
import type { Page, FrameLocator } from 'playwright';
import { chromium } from 'playwright';

import type { Config } from './config';

const now = () => new Date().getTime();
const TIMEOUT = 20000;

export const browse = async (url: string, config: Config) => {
  if (!config.managerLoaded && !config.previewLoadedText) return undefined;

  const start = now();
  let managerLoaded;
  let previewLoaded;

  const browser = await chromium.launch(/* { headless: false } */);
  const page = await browser.newPage();
  page.on('console', (msg: any) => {
    const type = msg.type();
    console.log(type, msg.text());
  });

  await page.goto(url);

  if (config.managerLoaded) {
    await page.waitForSelector(config.managerLoaded, { state: 'attached' });
    managerLoaded = now() - start;
    console.log('manager', new Date(), config.managerLoaded, managerLoaded);
  }

  if (config.previewLoadedText) {
    let previewFrame: FrameLocator | Page;
    previewFrame = page;
    if (config.previewFrameLocator) {
      previewFrame = await page.frameLocator(config.previewFrameLocator);
    }

    let actualText;
    while (now() - start < TIMEOUT && (!actualText || !actualText.length)) {
      const preview = await previewFrame.getByText(config.previewLoadedText);
      actualText = await preview.innerText();
    }
    console.log({ actualText });
    if (!actualText?.includes(config.previewLoadedText)) {
      throw new Error('previewLoadedText not found');
    }
    previewLoaded = now() - start;
    console.log('preview', new Date(), config.previewLoadedText, previewLoaded);
  }

  await browser.close();
  return { managerLoaded, previewLoaded };
};
