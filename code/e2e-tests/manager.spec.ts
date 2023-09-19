import { test, expect } from '@playwright/test';
import process from 'process';
import { SbPage } from './util';

const storybookUrl = process.env.STORYBOOK_URL || 'http://localhost:8001';

test.describe('Manager UI', () => {
  // TODO: test dragging and resizing

  test.beforeEach(async ({ page }) => {
    await page.goto(storybookUrl);

    await new SbPage(page).waitUntilLoaded();
  });

  test('Sidebar toggling', async ({ page }) => {
    const sbPage = new SbPage(page);

    await expect(sbPage.page.locator('.sidebar-container')).toBeVisible();

    // toggle with keyboard shortcut
    await sbPage.page.locator('html').press('s');
    await expect(sbPage.page.locator('.sidebar-container')).not.toBeVisible();
    await sbPage.page.locator('html').press('s');
    await expect(sbPage.page.locator('.sidebar-container')).toBeVisible();

    // toggle with menu item
    await sbPage.page.locator('[aria-label="Shortcuts"]').click();
    await sbPage.page.locator('#list-item-S').click();
    await expect(sbPage.page.locator('.sidebar-container')).not.toBeVisible();

    // toggle with "show sidebar" button
    await sbPage.page.locator('[aria-label="Show sidebar"]').click();
    await expect(sbPage.page.locator('.sidebar-container')).toBeVisible();
  });

  test('Toolbar toggling', async ({ page }) => {
    const sbPage = new SbPage(page);
    const expectToolbarVisibility = async (visible: boolean) => {
      expect(async () => {
        const toolbar = await sbPage.page.locator(`[data-test-id="sb-preview-toolbar"]`);
        const marginTop = await toolbar.evaluate(
          (element) => window.getComputedStyle(element).marginTop
        );
        expect(marginTop).toBe(visible ? '0px' : '-40px');
      }).toPass({ intervals: [400] });
    };

    await expectToolbarVisibility(true);

    // toggle with keyboard shortcut
    await sbPage.page.locator('html').press('t');
    await expectToolbarVisibility(false);
    await sbPage.page.locator('html').press('t');
    await expectToolbarVisibility(true);

    // toggle with menu item
    await sbPage.page.locator('[aria-label="Shortcuts"]').click();
    await sbPage.page.locator('#list-item-T').click();
    await expectToolbarVisibility(false);
    await sbPage.page.locator('[aria-label="Shortcuts"]').click();
    await sbPage.page.locator('#list-item-T').click();
    await expectToolbarVisibility(true);
  });

  test.describe('Panel', () => {
    test('Hidden in docs view', async ({ page }) => {
      const sbPage = new SbPage(page);

      // navigate to docs to hide panel
      await sbPage.navigateToStory('example/button', 'docs');

      await expect(sbPage.page.locator('#storybook-panel-root')).not.toBeVisible();

      // toggle with keyboard shortcut
      await sbPage.page.locator('html').press('a');
      await expect(sbPage.page.locator('#storybook-panel-root')).not.toBeVisible();
      await sbPage.page.locator('html').press('a');
      await expect(sbPage.page.locator('#storybook-panel-root')).not.toBeVisible();
    });

    test('Toggling', async ({ page }) => {
      const sbPage = new SbPage(page);

      // navigate to story to show panel
      await sbPage.navigateToStory('example/button', 'primary');

      await expect(sbPage.page.locator('#storybook-panel-root')).toBeVisible();

      // toggle with keyboard shortcut
      await sbPage.page.locator('html').press('a');
      await expect(sbPage.page.locator('#storybook-panel-root')).not.toBeVisible();
      await sbPage.page.locator('html').press('a');
      await expect(sbPage.page.locator('#storybook-panel-root')).toBeVisible();

      // toggle with menu item
      await sbPage.page.locator('[aria-label="Shortcuts"]').click();
      await sbPage.page.locator('#list-item-A').click();
      await expect(sbPage.page.locator('#storybook-panel-root')).not.toBeVisible();

      // toggle with "show addons" button
      await sbPage.page.locator('[aria-label="Show addons"]').click();
      await expect(sbPage.page.locator('#storybook-panel-root')).toBeVisible();
    });

    test('Positioning', async ({ page }) => {
      const sbPage = new SbPage(page);

      // navigate to story to show panel
      await sbPage.navigateToStory('example/button', 'primary');

      await expect(sbPage.page.locator('#storybook-panel-root')).toBeVisible();

      // toggle position with keyboard shortcut
      await sbPage.page.locator('html').press('d');
      await expect(sbPage.page.locator('#storybook-panel-root')).toBeVisible();
      // TODO: how to assert panel position?

      // hide with keyboard shortcut
      await sbPage.page.locator('html').press('a');
      await expect(sbPage.page.locator('#storybook-panel-root')).not.toBeVisible();

      // toggling position should also show the panel again
      await sbPage.page.locator('html').press('d');
      await expect(sbPage.page.locator('#storybook-panel-root')).toBeVisible();
    });
  });

  test('Fullscreen toggling', async ({ page }) => {
    const sbPage = new SbPage(page);

    // navigate to story to show panel
    await sbPage.navigateToStory('example/button', 'primary');

    await expect(sbPage.page.locator('#storybook-panel-root')).toBeVisible();
    await expect(sbPage.page.locator('.sidebar-container')).toBeVisible();

    // toggle with keyboard shortcut
    await sbPage.page.locator('html').press('f');
    await expect(sbPage.page.locator('#storybook-panel-root')).not.toBeVisible();
    await expect(sbPage.page.locator('.sidebar-container')).not.toBeVisible();

    await sbPage.page.locator('html').press('f');
    await expect(sbPage.page.locator('#storybook-panel-root')).toBeVisible();
    await expect(sbPage.page.locator('.sidebar-container')).toBeVisible();

    // toggle with menu item
    await sbPage.page.locator('[aria-label="Shortcuts"]').click();
    await sbPage.page.locator('#list-item-F').click();
    await expect(sbPage.page.locator('.sidebar-container')).not.toBeVisible();
    await expect(sbPage.page.locator('#storybook-panel-root')).not.toBeVisible();

    // toggle with "go/exit fullscreen" button
    await sbPage.page.locator('[aria-label="Exit full screen"]').click();
    await expect(sbPage.page.locator('#storybook-panel-root')).toBeVisible();
    await expect(sbPage.page.locator('.sidebar-container')).toBeVisible();

    await sbPage.page.locator('[aria-label="Go full screen"]').click();
    await expect(sbPage.page.locator('#storybook-panel-root')).not.toBeVisible();
    await expect(sbPage.page.locator('.sidebar-container')).not.toBeVisible();

    // go fullscreen when sidebar is shown but panel is hidden
    await sbPage.page.locator('[aria-label="Show sidebar"]').click();
    await sbPage.page.locator('[aria-label="Go full screen"]').click();
    await expect(sbPage.page.locator('#storybook-panel-root')).not.toBeVisible();
    await expect(sbPage.page.locator('.sidebar-container')).not.toBeVisible();

    // go fullscreen when panel is shown but sidebar is hidden
    await sbPage.page.locator('[aria-label="Show addons"]').click();
    await sbPage.page.locator('[aria-label="Go full screen"]').click();
    await expect(sbPage.page.locator('#storybook-panel-root')).not.toBeVisible();
    await expect(sbPage.page.locator('.sidebar-container')).not.toBeVisible();
  });

  test('Settings page', async ({ page }) => {
    const sbPage = new SbPage(page);
    await sbPage.page.locator('[aria-label="Shortcuts"]').click();
    await sbPage.page.locator('#list-item-about').click();

    await expect(sbPage.page.url()).toContain('/settings/about');

    await expect(sbPage.page.locator('#storybook-panel-root')).not.toBeVisible();

    await sbPage.page.locator('[title="Close settings page"]').click();
    await expect(sbPage.page.url()).not.toContain('/settings/about');
  });
});
