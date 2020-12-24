// TODO: add client-api as dependency
// eslint-disable-next-line import/no-extraneous-dependencies
import { defaultDecorateStory, combineParameters } from '@storybook/client-api';
import { GlobalConfig, Meta, Story, StoryContext } from './types-6-0';

/**
 * Function that will receive a story along with meta (e.g. a default export from a .stories file)
 * and optionally a globalConfig e.g. (import * from '../.storybook/preview)
 * and will return a composed component that has all args/parameters/decorators/etc combined and applied to it.
 *
 *
 * It's very useful for reusing a story in scenarios outside of Storybook like unit testing.
 *
 * Example:
 *```jsx
 * import { render } from '@testing-library/react';
 * import { composeStory } from '@storybook/react';
 * import Meta, { Primary as PrimaryStory } from './Button.stories';
 * import * as globalConfig from '../.storybook/preview';
 *
 * const Primary = composeStory(PrimaryStory, Meta, globalConfig);
 *
 * test('renders primary button with Hello World', () => {
 *   const { getByText } = render(<Primary>Hello world</Primary>);
 *   expect(getByText(/Hello world/i)).not.toBeNull();
 * });
 *```
 *
 * @param story
 * @param meta e.g. (import Meta from './Button.stories')
 * @param globalConfig e.g. (import * as globalConfig from '../.storybook/preview')
 */
export function composeStory<GenericArgs>(
  story: Story<GenericArgs>,
  meta: Meta,
  globalConfig: GlobalConfig = {}
) {
  const finalStoryFn = (context: StoryContext) => {
    const { passArgsFirst = true } = context.parameters;
    return passArgsFirst ? story(context.args as GenericArgs, context) : story(context);
  };

  const combinedDecorators = [
    ...(story.decorators || story.story?.decorators || []),
    ...(meta?.decorators || []),
    ...(globalConfig?.decorators || []),
  ];

  const decorated = defaultDecorateStory(finalStoryFn, combinedDecorators);

  return ((extraArgs: Record<string, any>) =>
    decorated({
      id: '',
      kind: '',
      name: '',
      argTypes: globalConfig.argTypes,
      globals: globalConfig.globalTypes,
      parameters: combineParameters(
        globalConfig.parameters || {},
        meta.parameters || {},
        story.parameters || {}
      ),
      args: {
        ...meta.args,
        ...story.args,
        ...extraArgs,
      },
    })) as Story<Partial<GenericArgs>>;
}

/**
 * Function that will receive a stories import (e.g. `import * as stories from './Button.stories'`)
 * and optionally a globalConfig (e.g. `import * from '../.storybook/preview`)
 * and will return an object containing all the stories passed, but now as a composed component that has all args/parameters/decorators/etc combined and applied to it.
 *
 *
 * It's very useful for reusing stories in scenarios outside of Storybook like unit testing.
 *
 * Example:
 *```jsx
 * import { render } from '@testing-library/react';
 * import { composeStories } from '@storybook/react';
 * import * as stories from './Button.stories';
 * import * as globalConfig from '../.storybook/preview';
 *
 * const { Primary, Secondary } = composeStories(stories, globalConfig);
 *
 * test('renders primary button with Hello World', () => {
 *   const { getByText } = render(<Primary>Hello world</Primary>);
 *   expect(getByText(/Hello world/i)).not.toBeNull();
 * });
 *```
 *
 * @param storiesImport e.g. (import * as stories from './Button.stories')
 * @param globalConfig e.g. (import * as globalConfig from '../.storybook/preview')
 */
export function composeStories<T extends { default: Meta } & { [K in keyof T]: T[K] }>(
  storiesImport: T,
  globalConfig: GlobalConfig = {}
) {
  const { default: meta, ...stories } = storiesImport;

  // Compose an object containing all processed stories passed as parameters
  return Object.entries(stories).reduce((storiesMap, [key, story]: [string, Story]) => {
    // eslint-disable-next-line no-param-reassign
    storiesMap[key] = composeStory(story, meta, globalConfig);
    return storiesMap;
  }, {} as { [key: string]: Story }) as Pick<T, Exclude<keyof T, 'default'>>;
}
