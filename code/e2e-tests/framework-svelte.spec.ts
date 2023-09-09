/* eslint-disable jest/no-disabled-tests */
import type { Locator } from '@playwright/test';
import { test, expect } from '@playwright/test';
import process from 'process';
import { SbPage } from './util';

const storybookUrl = process.env.STORYBOOK_URL || 'http://localhost:6006';
const templateName = process.env.STORYBOOK_TEMPLATE_NAME;

test.describe('Svelte', () => {
  test.skip(
    // eslint-disable-next-line jest/valid-title
    !templateName?.includes('svelte') || templateName?.includes('-ts'),
    'Only run this test on Svelte with javascript'
  );

  test.beforeEach(async ({ page }) => {
    await page.goto(storybookUrl);
    await new SbPage(page).waitUntilLoaded();
  });

  test('Story have a documentation', async ({ page }) => {
    const sbPage = new SbPage(page);

    sbPage.navigateToStory('example/button', 'docs');
    const root = sbPage.previewRoot();
    const argsTable = root.locator('.docblock-argstable');
    await expect(argsTable).toContainText('Is this the principal call to action on the page');
  });
});
