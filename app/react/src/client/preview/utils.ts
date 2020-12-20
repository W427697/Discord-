// TODO: add client-api as dependency
import { defaultDecorateStory, combineParameters } from '@storybook/client-api';
import { GlobalConfig, Meta, Story, StoryContext } from './types-6-0';

function composeStory<GenericArgs>(
  meta: Meta,
  globalConfig: GlobalConfig,
  story: Story<GenericArgs>
) {
  const finalStoryFn = (context: StoryContext) => {
    const { passArgsFirst = true } = context.parameters;
    return passArgsFirst ? story(context.args as GenericArgs, context) : story(context);
  };

  const combinedDecorators = [
    ...(globalConfig?.decorators || []),
    ...(meta?.decorators || []),
    ...(story.decorators || story.story?.decorators || []),
  ];

  const decorated = defaultDecorateStory(finalStoryFn, combinedDecorators);

  return (extraArgs: Record<string, any>) =>
    decorated({
      id: '',
      kind: '', // TODO: figure out about id, kind and name.
      name: '', // is there any scenario that we might need them?
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
    });
}

export function composeStories<T extends { default: Meta } & { [key: string]: Story }>(
  storiesImport: T,
  globalConfig: GlobalConfig = {}
) {
  const { default: meta, ...stories } = storiesImport;
  const initial: { [key: string]: Story } = {};
  // Compose an object containing all processed stories passed as parameters
  return Object.entries(stories).reduceRight((storiesMap, [key, value]: [string, Story]) => {
    // @ts-ignore FIX THIS LATER PLEASE!
    // eslint-disable-next-line no-param-reassign
    storiesMap[key] = composeStory(meta, globalConfig, value);
    return storiesMap;
  }, initial);
}
