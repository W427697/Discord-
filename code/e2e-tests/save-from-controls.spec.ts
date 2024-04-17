import { test } from '@playwright/test';
import process from 'process';
import { SbPage } from './util';

const storybookUrl = process.env.STORYBOOK_URL || 'http://localhost:8001';
const type = process.env.STORYBOOK_TYPE || 'dev';

test.describe('save-from-controls', () => {
  test.skip(type === 'build', `Skipping save-from-controls tests for production Storybooks`);

  test('Should be able to update a story', async ({ page }) => {
    await page.goto(storybookUrl);
    const sbPage = new SbPage(page);
    await sbPage.waitUntilLoaded();

    await sbPage.navigateToStory('example/button', 'primary');
    await sbPage.viewAddonPanel('Controls');

    // Update an arg
    const label = sbPage.panelContent().locator('textarea[name=label]');
    const value = await label.inputValue();
    await label.fill(value + ' Updated');

    // Assert the footer is shown
    await sbPage.panelContent().locator('[data-short-label="Unsaved changes"]').isVisible();

    // update the story
    await sbPage.panelContent().locator('button').getByText('Update story').click();

    // Assert the file is saved
    const notification1 = await sbPage.page.waitForSelector('[title="Story saved"]');
    await notification1.isVisible();

    // dismiss
    await notification1.click();
    await notification1.isHidden();

    await sbPage.navigateToStory('example/button', 'primary');
    await sbPage.viewAddonPanel('Controls');

    // Update an arg
    await label.fill(value + ' Copied');

    // Assert the footer is shown
    await sbPage.panelContent().locator('[data-short-label="Unsaved changes"]').isVisible();

    // clone the story
    await sbPage.panelContent().locator('button').getByText('Create new story').click();

    (await sbPage.page.waitForSelector('[placeholder="Story export name"]')).fill('ClonedStory');
    const submit = await sbPage.page.waitForSelector('[type="submit"]');
    await submit.click();

    // Assert the file is saved
    const notification2 = await sbPage.page.waitForSelector('[title="Story created"]');
    await notification2.isVisible();
    await notification2.click();
  });
});
