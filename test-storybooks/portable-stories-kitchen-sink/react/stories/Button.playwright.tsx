import { test, expect } from '@playwright/experimental-ct-react';
// import { addons } from '@storybook/preview-api';

import stories from './Button.portable';
// import { composeStory } from '@storybook/react';

// import { Button } from './Button';

// example with composeStories, returns an object with all stories composed with args/decorators

// example with composeStory, returns a single story composed with args/decorators
// const Secondary = composeStory(stories.CSF2Secondary, stories.default);
test('renders primary button', async ({ mount }) => {
  const component = await mount(<stories.CSF3Primary />);
  await expect(component).toContainText('Decorator')
  // const element = await component.evaluate((element) => {
  //   // You can interact with the element directly here
  //   return element; // This returns the DOM element to Playwright's context
  // });

  // console.log({bla: stories.CSF3InputFieldFilled  })
  // await stories.CSF3InputFieldFilled.play({ canvasElement: element as HTMLElement });
  // expect(button).toContainText('Hello world')
  // const buttonElement = screen.getByText(/Hello world/i);
  // expect(buttonElement).not.toBeNull();
});
