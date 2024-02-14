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
});

test.only('apply story loaders', async ({ mount, page }) => {


  // await stories.LoaderStory.load();
  await mount(<stories.CSF3InputFieldFilled />);
    // console.log({loaderStory: globalThis.__STORYBOOK_TESTSTUFF })
    await page.evaluate(async() => {
      console.log('LOG: stuff', { __STORYBOOK_TESTSTUFF: globalThis.__STORYBOOK_TESTSTUFF})
      const story = globalThis.__STORYBOOK_TESTSTUFF['CSF3InputFieldFilled']
      console.log({story})
      await story.play({ canvasElement: document.body });  
    })
});

// test('reuses args from composed story', ({ mount }) => {
//   mount(<Secondary />);
//   const buttonElement = screen.getByRole('button');
//   expect(buttonElement.textContent).toEqual(Secondary.args.children);
// });

// test('onclick handler is called', async ({ mount }) => {
//   const onClickSpy = vi.fn();
//   mount(<Secondary onClick={onClickSpy} />);
//   const buttonElement = screen.getByRole('button');
//   buttonElement.click();
//   expect(onClickSpy).toHaveBeenCalled();
// });

// test('reuses args from composeStories', ({ mount }) => {
//   const { getByText } = mount(<CSF3Primary />);
//   const buttonElement = getByText(/foo/i);
//   expect(buttonElement).not.toBeNull();
// });

// test('renders with default projectAnnotations', ({ mount }) => {
//   const WithEnglishText = composeStory(stories.CSF2StoryWithLocale, stories.default);
//   const { getByText } = mount(<WithEnglishText />);
//   const buttonElement = getByText('Hello!');
//   expect(buttonElement).not.toBeNull();
// });

// test('renders with custom projectAnnotations via composeStory params', ({ mount }) => {
//   const WithPortugueseText = composeStory(stories.CSF2StoryWithLocale, stories.default, {
//     globalTypes: { locale: { defaultValue: 'pt' } } as any,
//   });
//   const { getByText } = mount(<WithPortugueseText />);
//   const buttonElement = getByText('Olá!');
//   expect(buttonElement).not.toBeNull();
// });

// test('renders with custom projectAnnotations via setProjectAnnotations', ({ mount }) => {
//   setProjectAnnotations([{ parameters: { injected: true } }]);
//   const Story = composeStory(stories.CSF2StoryWithLocale, stories.default);
//   expect(Story.parameters?.injected).toBe(true);
// });

// test('renders with inferred globalRender', ({ mount }) => {
//   const Primary = composeStory(stories.CSF3Button, stories.default);

//   mount(<Primary>Hello world</Primary>);
//   const buttonElement = screen.getByText(/Hello world/i);
//   expect(buttonElement).not.toBeNull();
// });

// test('renders with custom render function', ({ mount }) => {
//   const Primary = composeStory(stories.CSF3ButtonWithRender, stories.default);

//   mount(<Primary />);
//   expect(screen.getByTestId('custom-render')).not.toBeNull();
// });

// test('renders with play function', async ({ mount }) => {
//   const CSF3InputFieldFilled = composeStory(stories.CSF3InputFieldFilled, stories.default);

//   const { container } = mount(<CSF3InputFieldFilled />);

//   await CSF3InputFieldFilled.play({ canvasElement: container });

//   const input = screen.getByTestId('input') as HTMLInputElement;
//   expect(input.value).toEqual('Hello world!');
// });

// // common in addons that need to communicate between manager and preview
// test('should pass with decorators that need addons channel', ({ mount }) => {
//   const PrimaryWithChannels = composeStory(stories.CSF3Primary, stories.default, {
//     decorators: [
//       (StoryFn: any) => {
//         addons.getChannel();
//         return StoryFn();
//       },
//     ],
//   });
//   mount(<PrimaryWithChannels>Hello world</PrimaryWithChannels>);
//   // const buttonElement = screen.getByText(/Hello world/i);
//   // expect(buttonElement).not.toBeNull();
// });

// // // Batch snapshot testing
// // const testCases = Object.values(composeStories(stories)).map((Story) => [Story.storyName, Story]);
// // it.each(testCases)('Renders %s story', async (_storyName, Story) => {
// //   cleanup();
// //   const tree = await mount(<Story />);
// //   expect(tree.baseElement).toMatchSnapshot();
// // });
