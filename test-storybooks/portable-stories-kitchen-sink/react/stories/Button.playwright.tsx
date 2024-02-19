/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTest } from '@storybook/react/experimental_playwright';
import { test as base, expect } from '@playwright/experimental-ct-react';
import stories from './Button.stories.playwright';

const test = createTest(base);

// Basic scenario that does not need loaders nor play fn
test('renders primary button', async ({ mount }) => {
  const component = await mount(<stories.CSF3Primary />);
  await expect(component).toContainText('Decorator')
});

test('loads, renders and plays a story using the SB fixture', async ({ mount }) => {
  await mount(<stories.LoaderStory/>);
});