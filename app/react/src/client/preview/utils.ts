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

export function composeStories(
  storiesImport: { default: Meta } & { [key: string]: Story },
  globalConfig: GlobalConfig = {}
) {
  const { default: meta, ...stories } = storiesImport;
  // Compose an object containing all processed stories passed as parameters
  return Object.entries(stories).reduce(
    (storiesMap: Record<string, Story>, [key, value]: [string, Story]) => {
      // @ts-ignore TODO: fix this
      // eslint-disable-next-line no-param-reassign
      storiesMap[key] = composeStory(meta, globalConfig, value);
      return storiesMap;
    },
    {}
  );
}
